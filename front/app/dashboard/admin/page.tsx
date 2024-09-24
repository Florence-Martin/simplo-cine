"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";

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
} from "../../types/types";

interface Screening {
  movieId: number;
  hallId: number;
  date: Date;
  startTime: string;
  duration: number;
}

export default function AdminDashboard() {
  const [movies, setMovies] = useState<MovieAttributes[]>([]);
  const [halls, setHalls] = useState<HallAttributes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [events, setEvents] = useState<MovieEvent[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MovieAttributes | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // calculateEndTime
  const calculateEndTime = (startTime: string, duration: number): string => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const endTime = new Date();
    endTime.setHours(hours, minutes);
    endTime.setMinutes(endTime.getMinutes() + duration);
    return endTime.toTimeString().slice(0, 5); // Retourne l'heure de fin au format "HH:MM"
  };

  // Fetch initial pour récupérer les films
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("/api/movies");
        if (!response.ok) {
          throw new Error("Erreur lors du fetch des films");
        }
        const data: MovieAttributes[] = await response.json();
        setMovies(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Fetch initial pour récupérer les salles
  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const response = await fetch("/api/rooms");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des salles.");
        }
        const data: HallAttributes[] = await response.json();
        setHalls(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(`Erreur lors de la récupération des salles: ${err.message}`);
        } else {
          setError("Erreur inconnue lors de la récupération des salles.");
        }
      }
    };

    fetchHalls();
  }, []);

  // Fetch initial pour récupérer les séances
  useEffect(() => {
    const fetchScreenings = async () => {
      try {
        const response = await fetch("/api/sessions");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des séances.");
        }
        const data: Screening[] = await response.json();
        setScreenings(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(
            `Erreur lors de la récupération des séances: ${err.message}`
          );
        } else {
          setError("Erreur inconnue lors de la récupération des séances.");
        }
      }
    };

    fetchScreenings();
  }, []);

  // Met à jour les événements du calendrier à chaque modification des films
  useEffect(() => {
    const updatedEvents: MovieEvent[] = screenings
      .map((screening) => {
        const movie = movies.find((m) => m.id === screening.movieId);
        if (!movie) return null;

        return {
          id: screening.movieId,
          title: movie.title,
          start: new Date(
            `${screening.date.toISOString().split("T")[0]}T${screening.startTime}`
          ),
          end: new Date(
            `${screening.date.toISOString().split("T")[0]}T${calculateEndTime(screening.startTime, screening.duration)}`
          ),
          desc: movie.description || "",
        };
      })
      .filter((event) => event !== null) as MovieEvent[];

    setEvents(updatedEvents);
  }, [screenings, movies]);

  // Fonction assignRandomType utilisant localStorage pour stocker le type de chaque film
  const assignRandomType = (movieId: number): string => {
    const types = ["Romance", "Comédie", "Horreur", "Science-fiction"];
    const storedTypes = JSON.parse(localStorage.getItem("movieTypes") || "{}");

    if (storedTypes[movieId]) {
      return storedTypes[movieId];
    }

    const randomIndex = Math.floor(Math.random() * types.length);
    const assignedType = types[randomIndex];
    storedTypes[movieId] = assignedType;
    localStorage.setItem("movieTypes", JSON.stringify(storedTypes));

    return assignedType;
  };

  const handleSelectEvent = (event: MovieEvent) => {
    const movie = movies.find((m) => m.id === event.id);
    if (movie) {
      setSelectedMovie(movie);
      setIsModalOpen(true);
    }
  };

  const handleAddMovie = async (newMovie: MovieAttributes) => {
    try {
      if (!newMovie.title || !newMovie.release_date || !newMovie.duration) {
        setError("Veuillez remplir tous les champs requis.");
        return;
      }

      const response = await fetch("/api/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMovie),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout du film à la base de données.");
      }

      const addedMovie = await response.json();
      setMovies((prevMovies) => [...prevMovies, addedMovie]);
      // Affiche le toast de succès
      setToastMessage("Le film a été ajouté avec succès !");
      setShowToast(true);
    } catch (err) {
      console.error("Erreur lors de l'ajout du film :", err);
      setError("Une erreur inconnue s'est produite lors de l'ajout du film.");
    }
  };

  const handleAddHall = (newHall: RoomAttributes) => {
    const hallWithId: HallAttributes = {
      ...newHall,
      id: newHall.room_id || Date.now(),
    };

    setHalls((prevHalls) => [...prevHalls, hallWithId]);
    setToastMessage("La salle a été ajoutée avec succès !");
    setShowToast(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  const handleModifyMovie = async (
    updatedMovie: MovieAttributes
  ): Promise<void> => {
    try {
      // Envoie une requête PUT pour mettre à jour le film dans la base de données
      const response = await fetch(`/api/movies/${updatedMovie.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMovie),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du film.");
      }

      const data = await response.json();

      // Met à jour l'état local avec les données modifiées
      setMovies(
        movies.map((movie) => (movie.id === updatedMovie.id ? data : movie))
      );
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du film :", error);
      setError("Erreur lors de la mise à jour du film.");
    }
  };

  const handleDeleteMovie = async () => {
    if (selectedMovie) {
      try {
        // Effectuer une requête DELETE pour supprimer le film de la base de données
        const response = await fetch(`/api/movies/${selectedMovie.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la suppression du film.");
        }

        // Supprimer le film de l'état local après une suppression réussie dans la base de données
        setMovies(movies.filter((movie) => movie.id !== selectedMovie.id));

        handleCloseModal();

        setToastMessage("Le film a été supprimé avec succès.");
        setShowToast(true);
      } catch (error) {
        console.error("Erreur lors de la suppression du film :", error);
        setError("Erreur lors de la suppression du film.");
      }
    }
  };

  const handleSchedule = async (newScreening: Screening) => {
    // Applique les règles de planification ici
    const isValidScreening = validateScreening(newScreening);

    if (!isValidScreening) {
      setError("La séance ne respecte pas les contraintes de planification.");
      return;
    }

    try {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movie_id: newScreening.movieId,
          room_id: newScreening.hallId,
          date: newScreening.date.toISOString().split("T")[0],
          heure_debut: newScreening.startTime,
          heure_fin: calculateEndTime(
            newScreening.startTime,
            newScreening.duration
          ),
          nb_spectateurs: 0,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout de la séance.");
      }

      // Mettre à jour les séances après l'ajout
      const addedScreening = await response.json();
      setScreenings((prevScreenings) => [...prevScreenings, addedScreening]);

      // Ajouter l'événement au calendrier
      const movie = movies.find((m) => m.id === newScreening.movieId);
      if (movie) {
        const newEvent: MovieEvent = {
          id: addedScreening.id,
          title: movie.title,
          start: new Date(
            `${newScreening.date.toISOString().split("T")[0]}T${newScreening.startTime}`
          ),
          end: new Date(
            `${newScreening.date.toISOString().split("T")[0]}T${calculateEndTime(newScreening.startTime, newScreening.duration)}`
          ),
          desc: movie.description || "",
        };

        setEvents((prevEvents) => [...prevEvents, newEvent]);
      }

      setToastMessage("Séance planifiée avec succès !");
      setShowToast(true);
    } catch (err) {
      console.error("Erreur lors de l'ajout de la séance :", err);
      setError("Erreur lors de l'ajout de la séance.");
    }
  };

  const validateScreening = (newScreening: Screening): boolean => {
    const { movieId, date, hallId, duration } = newScreening;
    const movie = movies.find((m) => m.id === movieId);
    if (!movie) return false;

    const screeningDate = new Date(date);
    const weekNumber = Math.ceil(
      (screeningDate.getTime() - new Date(movie.release_date || "").getTime()) /
        (7 * 24 * 60 * 60 * 1000)
    );

    // Vérifier les contraintes de diffusion par semaine
    if (
      (weekNumber === 3 || weekNumber === 4) &&
      getScreeningsCountForDay(screeningDate, movieId, hallId) >= 3
    ) {
      return false;
    }
    if (
      weekNumber === 5 &&
      getScreeningsCountForDay(screeningDate, movieId, hallId) >= 1
    ) {
      return false;
    }

    // Vérifier l'intervalle de 20 minutes entre les séances
    if (!checkTimeInterval(screeningDate, duration, hallId)) {
      return false;
    }

    // Vérifier que la séance est programmée entre 10h00 et 23h00
    const screeningEndTime = new Date(screeningDate);
    screeningEndTime.setMinutes(screeningEndTime.getMinutes() + duration);
    if (
      screeningDate.getHours() < 10 ||
      screeningEndTime.getHours() > 23 ||
      (screeningEndTime.getHours() === 23 && screeningEndTime.getMinutes() > 0)
    ) {
      return false;
    }

    return true;
  };

  const getScreeningsCountForDay = (
    screeningDate: Date,
    movieId: number,
    hallId: number
  ): number => {
    return screenings.filter(
      (s) =>
        s.movieId === movieId &&
        s.hallId === hallId &&
        s.date.toDateString() === screeningDate.toDateString()
    ).length;
  };

  const checkTimeInterval = (
    screeningDate: Date,
    duration: number,
    hallId: number
  ): boolean => {
    const screeningEndTime = new Date(screeningDate);
    screeningEndTime.setMinutes(screeningEndTime.getMinutes() + duration);

    for (const s of screenings) {
      if (s.hallId === hallId) {
        const existingStart = new Date(s.date);
        const existingEnd = new Date(s.date);
        existingEnd.setMinutes(existingStart.getMinutes() + s.duration);

        if (
          (screeningDate >= existingStart && screeningDate < existingEnd) ||
          (screeningEndTime > existingStart && screeningEndTime <= existingEnd)
        ) {
          return false; // Chevauchement détecté
        }
      }
    }

    return true;
  };

  useEffect(() => {
    const updatedEvents: MovieEvent[] = screenings
      .map((screening) => {
        const movie = movies.find((m) => m.id === screening.movieId);
        if (!movie) return null;

        return {
          id: screening.movieId,
          title: movie.title,
          start: new Date(
            `${screening.date.toISOString().split("T")[0]}T${screening.startTime}`
          ),
          end: new Date(
            `${screening.date.toISOString().split("T")[0]}T${calculateEndTime(screening.startTime, screening.duration)}`
          ),
          desc: movie.description || "",
        };
      })
      .filter((event) => event !== null) as MovieEvent[];

    setEvents(updatedEvents);
  }, [screenings, movies]);

  return (
    <div className="min-h-screen p-6 flex flex-col items-center">
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
              <div className="movie-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {movies.map((movie) => (
                  <Card
                    key={movie.id}
                    id={movie.id}
                    title={movie.title}
                    description={movie.description}
                    type={assignRandomType(movie.id)} // Utilisation de la fonction assignRandomType pour définir le type
                    release_date={movie.release_date?.toString()}
                    duration={movie.duration}
                    created_at={new Date().toISOString()}
                    updated_at={new Date().toISOString()}
                    isAdmin={() => true}
                    onModify={handleModifyMovie}
                    onDelete={(movieId) =>
                      setMovies(movies.filter((movie) => movie.id !== movieId))
                    }
                  />
                ))}
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
              {/* Ajout du composant ScheduleScreeningForm ici */}
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
