"use client";

import { useState, useEffect } from "react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import moment from "moment";

import Card from "../../components/Card";
import { AddHallCard } from "../../components/resources/AddHallCard";
import { AddMovieCard } from "../../components/resources/AddMovieCard";
import { MovieCalendar } from "../../components/resources/MovieCalendar";
import { MovieView } from "../../components/resources/MovieView";
import { ScheduleScreeningForm } from "../../components/resources/ScheduleScreeningForm";
import {
  MovieAttributes,
  HallAttributes,
  MovieEvent,
  RoomAttributes,
  ScreeningAttributes,
} from "../../types/types";
import { assignRandomType } from "../../utils/assignRandomType";

export default function AdminDashboard() {
  const [movies, setMovies] = useState<MovieAttributes[]>([]);
  const [halls, setHalls] = useState<HallAttributes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [screenings, setScreenings] = useState<ScreeningAttributes[]>([]);
  const [events, setEvents] = useState<MovieEvent[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MovieAttributes | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Fetch initial pour récupérer les données
  useEffect(() => {
    fetchData("/api/movies", setMovies, "Erreur lors du fetch des films");
    fetchData(
      "/api/rooms",
      setHalls,
      "Erreur lors de la récupération des salles."
    );
    fetchData(
      "/api/sessions",
      setScreenings,
      "Erreur lors de la récupération des séances."
    );
  }, []);

  // Un seul useEffect pour mettre à jour les événements
  useEffect(() => {
    const movieEvents = movies.map((movie) => {
      const releaseDate = new Date(movie.release_date || "");
      const start = isNaN(releaseDate.getTime()) ? new Date() : releaseDate;

      return {
        id: movie.id,
        title: movie.title,
        start: start,
        end: new Date(
          moment(start)
            .add(movie.duration || 120, "minutes")
            .toDate()
        ),
        desc: movie.description || "",
      };
    });

    const screeningEvents = screenings
      .map((screening) => {
        const movie = movies.find((m) => m.id === screening.movieId);
        if (!movie) return null;
        return createEvent(screening, movie);
      })
      .filter(Boolean) as MovieEvent[];

    setEvents([...movieEvents, ...screeningEvents]);
  }, [movies, screenings]);

  // Récupération des données générique
  const fetchData = async (
    url: string,
    setData: React.Dispatch<React.SetStateAction<any>>,
    errorMessage: string
  ) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(errorMessage);
      const data = await response.json();
      setData(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur inconnue s'est produite"
      );
    } finally {
      setLoading(false);
    }
  };

  // Créer un événement de calendrier
  const createEvent = (
    screening: ScreeningAttributes,
    movie: MovieAttributes
  ): MovieEvent => ({
    id: screening.id,
    title: movie.title,
    start: new Date(
      `${screening.date.toISOString().split("T")[0]}T${screening.startTime}`
    ),
    end: new Date(
      `${screening.date.toISOString().split("T")[0]}T${screening.endTime}`
    ),
    desc: movie.description || "",
  });

  // Gérer l'ajout d'un film
  const handleAddMovie = async (newMovie: MovieAttributes) => {
    if (!newMovie.title || !newMovie.release_date || !newMovie.duration) {
      setError("Veuillez remplir tous les champs requis.");
      return;
    }

    const addedMovie = await handleApiRequest(
      "/api/movies",
      "POST",
      newMovie,
      setMovies,
      "Le film a été ajouté avec succès !"
    );

    if (addedMovie) {
      const defaultEvent: MovieEvent = {
        id: addedMovie.id,
        title: addedMovie.title,
        start: new Date(addedMovie.release_date),
        end: new Date(
          moment(new Date(addedMovie.release_date))
            .add(addedMovie.duration || 120, "minutes")
            .toDate()
        ),
        desc: addedMovie.description || "Aucune description",
      };

      setEvents((prevEvents) => [...prevEvents, defaultEvent]);
    }
  };

  // Gérer l'ajout d'une salle
  const handleAddHall = (newHall: RoomAttributes) => {
    const hallWithId: HallAttributes = {
      ...newHall,
      id: newHall.room_id || Date.now(),
    };
    setHalls((prevHalls) => [...prevHalls, hallWithId]);
    showToastMessage("La salle a été ajoutée avec succès !");
  };

  // Gérer la planification d'une séance
  const handleSchedule = async (
    newScreening: Omit<ScreeningAttributes, "id">
  ) => {
    const body = {
      ...newScreening,
      heure_debut: newScreening.startTime,
      heure_fin: newScreening.endTime,
      nb_spectateurs: newScreening.spectatorsCount || 0,
    };

    const addedScreening = await handleApiRequest(
      "/api/sessions",
      "POST",
      body,
      setScreenings,
      "Séance planifiée avec succès !"
    );

    if (addedScreening) {
      const movie = movies.find((m) => m.id === newScreening.movieId);
      if (movie)
        setEvents((prevEvents) => [
          ...prevEvents,
          createEvent(addedScreening, movie),
        ]);
    }
  };

  // Gérer la modification d'un film
  const handleModifyMovie = async (updatedMovie: MovieAttributes) => {
    const updated = await handleApiRequest(
      `/api/movies/${updatedMovie.id}`,
      "PUT",
      updatedMovie,
      (movies) =>
        setMovies(
          movies.map((movie: MovieAttributes) =>
            movie.id === updatedMovie.id ? updatedMovie : movie
          )
        ),
      "Le film a été mis à jour avec succès !"
    );

    if (updated) setIsModalOpen(false);
  };

  // Gérer la suppression d'un film
  const handleDeleteMovie = async () => {
    if (!selectedMovie) return;
    const deleted = await handleApiRequest(
      `/api/movies/${selectedMovie.id}`,
      "DELETE",
      {},
      (movies) =>
        setMovies(
          movies.filter(
            (movie: MovieAttributes) => movie.id !== selectedMovie.id
          )
        ),
      "Le film a été supprimé avec succès."
    );

    if (deleted) {
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== selectedMovie.id)
      );
      handleCloseModal();
    }
  };

  // Gestion des requêtes API
  const handleApiRequest = async (
    url: string,
    method: string,
    body: any,
    updateState: React.Dispatch<React.SetStateAction<any>>,
    successMessage: string
  ) => {
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Erreur lors de la requête.");

      const data = await response.json();
      updateState((prevState: any) => [...prevState, data]);
      showToastMessage(successMessage);
      return data;
    } catch (err) {
      console.error("Erreur lors de l'opération :", err);
      setError(
        `Une erreur s'est produite : ${err instanceof Error ? err.message : "Erreur inconnue"}`
      );
      return null;
    }
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const handleSelectEvent = (event: MovieEvent) => {
    const movie = movies.find((m) => m.id === event.id);
    if (movie) {
      setSelectedMovie(movie);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        Gestion des Films et des Salles
      </h1>

      {showToast && (
        <div className="fixed top-4 right-4 flex w-96 shadow-lg rounded-lg">
          <div className="bg-green-600 py-4 px-6 rounded-l-lg flex items-center">
            <AiOutlineCheck className="text-white" size={20} />
          </div>
          <div className="px-4 py-6 bg-white rounded-r-lg flex justify-between items-center w-full border border-l-transparent border-gray-200">
            <div>{toastMessage}</div>
            <button onClick={() => setShowToast(false)}>
              <AiOutlineClose className="text-gray-700" size={20} />
            </button>
          </div>
        </div>
      )}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Erreur : {error}</p>}

      {!loading && !error && (
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne 1: Calendrier et Liste des Films */}
          <div className="lg:col-span-2 space-y-6 relative">
            <h2 className="text-xl pl-6 font-medium text-gray-900 py-2">
              Calendrier des Films
            </h2>
            <div className="bg-orange-500 absolute top-9 left-2 w-[calc(20%)] h-2"></div>
            <MovieCalendar events={events} onSelectEvent={handleSelectEvent} />

            <div className="rounded-lg relative">
              <h2 className="text-xl pl-6 text-gray-900 font-medium py-2">
                Liste des Films
              </h2>
              <div className="bg-orange-500 absolute top-9 left-2 w-[calc(20%)] h-2"></div>
              <div className="movie-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {movies.map((movie) => {
                  const createdAtString = movie.created_at
                    ? new Date(movie.created_at).toISOString()
                    : "";
                  const updatedAtString = movie.updated_at
                    ? new Date(movie.updated_at).toISOString()
                    : "";

                  return (
                    <Card
                      key={movie.id}
                      id={movie.id}
                      title={movie.title}
                      description={movie.description}
                      type={assignRandomType(movie.id)}
                      release_date={
                        movie.release_date
                          ? new Date(movie.release_date).toISOString()
                          : undefined
                      }
                      duration={movie.duration}
                      created_at={createdAtString}
                      updated_at={updatedAtString}
                      isAdmin={() => true}
                      onModify={handleModifyMovie}
                      onDelete={(movieId) =>
                        setMovies(
                          movies.filter((movie) => movie.id !== movieId)
                        )
                      }
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Colonne 2: Formulaires à droite */}
          <div className="space-y-6">
            <div className="rounded-lg shadow-md">
              <AddMovieCard onAddMovie={handleAddMovie} />
            </div>
            <div className="rounded-lg shadow-md">
              <AddHallCard onAddHall={handleAddHall} halls={halls} />
              <div className="rounded-lg shadow-md">
                <ScheduleScreeningForm
                  movies={movies}
                  halls={halls}
                  existingScreenings={screenings}
                  onSchedule={handleSchedule}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {selectedMovie && (
        <MovieView
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          movie={selectedMovie}
          onModify={handleModifyMovie}
          onDelete={handleDeleteMovie}
          availableHalls={halls}
          isAdmin={() => true}
        />
      )}
    </div>
  );
}
