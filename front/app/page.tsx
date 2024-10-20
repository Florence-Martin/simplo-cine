"use client";

// import { jwtDecode } from "jwt-decode";
import Image from "next/image";
import { Carousel, CarouselResponsiveOption } from "primereact/carousel";
import { ProgressSpinner } from "primereact/progressspinner";
import * as React from "react";
import { useEffect, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";

import Card from "./components/Card";
import { assignRandomType } from "./utils/assignRandomType";

interface Movie {
  id: number;
  title: string;
  description?: string;
  release_date?: string;
  duration?: number;
}

// interface DecodedToken {
//   id: number;
//   role: string;
//   iat: number;
//   exp: number;
// }

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [moviesWithDate, setMoviesWhitDate] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Fonction pour récupérer un cookie par son nom
  const getCookieValue = (name: string): string | null => {
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));
    return cookie ? cookie.split("=")[1] : null;
  };
  // Fonction pour décoder un JWT manuellement
  const decodeJWT = (token: string) => {
    const payload = token.split(".")[1]; // Récupérer la 2ème partie du JWT (le payload)
    const decodedPayload = atob(payload); // Décoder en base64
    return JSON.parse(decodedPayload); // Convertir en objet JavaScript
  };
  // Utiliser useEffect pour vérifier le token au chargement du composant
  useEffect(() => {
    const authToken = getCookieValue("authToken");

    if (authToken) {
      const decodedToken = decodeJWT(authToken);
      console.log("Token décodé:", decodedToken); // Affiche les données du token

      // Vérifier le rôle de l'utilisateur
      setUserRole(decodedToken.role.role_name);
    }
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("/api/movies");
        if (!response.ok) {
          throw new Error("Erreur lors du fetch des films");
        }
        const data = await response.json();
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

  const isAdmin = (): boolean => {
    return userRole === "Admin";
  };

  console.log("isAdmin", isAdmin());

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleDateInputChange = async () => {
    const dateInput = document.querySelector(
      'input[type="date"]'
    ) as HTMLInputElement;
    if (dateInput) {
      const selectedDate = dateInput.value;
      setSelectedDate(selectedDate);

      if (selectedDate) {
        try {
          // Appel au service session pour récupérer les sessions par date
          const sessionResponse = await fetch(
            `/api/sessions/date/${selectedDate}`
          );
          if (!sessionResponse.ok) {
            throw new Error(
              "Erreur lors de la recherche des sessions par date"
            );
          }
          const sessionsData = await sessionResponse.json();

          // Vérifier s'il y a des sessions
          if (sessionsData.length === 0) {
            setMoviesWhitDate([]); // Réinitialiser l'état des films
            setError("Aucune séance ce jour là"); // Réinitialiser l'erreur
            return; // Sortir de la fonction
          }

          // Extraire les movie_id des sessions
          const movieIds = sessionsData.map(
            (session: { movie_id: number }) => session.movie_id
          );

          if (movieIds.length > 0) {
            // Appel au service movie pour récupérer les films par IDs
            const movieResponses = await Promise.all(
              movieIds.map((movieId: number) => fetch(`/api/movies/${movieId}`))
            );

            const moviesData = await Promise.all(
              movieResponses.map((res) => {
                if (!res.ok) {
                  throw new Error("Erreur lors de la récupération des films");
                }
                return res.json();
              })
            );

            console.log("Films récupérés :", moviesData);
            setMoviesWhitDate(moviesData); // Stocke les films récupérés dans l'état
          } else {
            setMoviesWhitDate([]); // Aucun film à afficher si pas de movie_id
          }
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("An unknown error occurred");
          }
        }
      }
    }
  };

  const responsiveOptions: CarouselResponsiveOption[] = [
    {
      breakpoint: "1400px",
      numVisible: 4,
      numScroll: 1,
    },
    {
      breakpoint: "1199px",
      numVisible: 4,
      numScroll: 1,
    },
    {
      breakpoint: "767px",
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: "575px",
      numVisible: 1,
      numScroll: 1,
    },
  ];

  const moviesTemplate = (movie: Movie) => {
    return (
      <Card
        key={movie.id}
        id={movie.id}
        title={movie.title}
        description={movie.description || "No description available"}
        type={assignRandomType(movie.id)}
        release_date={movie.release_date}
        duration={movie.duration}
        created_at={new Date().toISOString()}
        updated_at={new Date().toISOString()}
        isAdmin={isAdmin}
      />
    );
  };

  return (
    <div>
      <div className="flex justify-center bg-black">
        <Image
          src="/AccueilSimplo.png"
          alt="Cinema"
          width={800}
          height={200}
          style={{ width: "auto", height: "200" }}
        />
      </div>
      {loading && (
        <div className="card flex justify-content-center">
          <ProgressSpinner />
        </div>
      )}
      {/* {error !== "null" && <Message severity="error" text={`Error: ${error}`} />} */}

      {/* Section de recherche par date */}
      <div className="flex flex-col items-center mb-10">
        <h2 className="text-2xl font-bold text-center mt-5 mb-10">
          Recherchez une séance par date pour voir les films disponibles
        </h2>
        <div className="flex justify-center w-full">
          <div className="w-full max-w-2xl flex items-center justify-between space-x-4">
            <div className="w-1/2 flex flex-col items-start space-y-4">
              <label className="block text-gray-900 mt-4">
                <FaCalendarAlt className="mr-2 inline-block text-red-600" />{" "}
                Date de séance
              </label>
              <input
                type="date"
                onChange={(e) => e.target.value}
                className="w-full px-3 py-2 border rounded-md text-gray-900"
              />
            </div>
            <div className="w-1/2 flex justify-end">
              <button
                onClick={() => {
                  handleDateInputChange();
                }}
                className="inline-flex justify-center rounded-md border border-transparent mt-14 shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Rechercher
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Affiche les films ou un message d'erreur */}
      {error ? (
        <h2 className="text-2xl font-bold text-center mt-5 mb-10">{error}</h2>
      ) : movies.length === 0 ? (
        <h2 className="text-2xl font-bold text-center mt-5 mb-10">
          Aucun film trouvé pour cette date.
        </h2>
      ) : (
        selectedDate && (
          <div>
            <h2 className="text-2xl font-bold text-center mt-5">
              Film du{" "}
              {selectedDate
                ? new Date(selectedDate).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
                : ""}
            </h2>
            <div className="movie-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              {moviesWithDate.map((movie) => (
                <Card
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  description={movie.description || "No description available"}
                  type={assignRandomType(movie.id)}
                  release_date={movie.release_date}
                  duration={movie.duration}
                  created_at={new Date().toISOString()}
                  updated_at={new Date().toISOString()}
                  isAdmin={isAdmin}
                />
              ))}
            </div>
          </div>
        )
      )}
      <hr className="border-t-2 border-gray-800 my-1 w-full" />
      <div className="bg-gray-800 py-4">
        <h2 className="text-2xl font-bold text-center text-white">À LA UNE</h2>
      </div>
      <hr className="border-t-2 border-gray-800 my-1 w-full" />
      <hr className="border-t-2 border-gray-800 mt-4 mb-8 w-full" />

      <div className="card mx-8">
        <Carousel
          value={movies}
          numScroll={1}
          numVisible={4}
          responsiveOptions={responsiveOptions}
          itemTemplate={moviesTemplate}
        />
      </div>

      <hr className="border-t-2 border-gray-800 mb-1 mt-20 w-full" />
      <div className="bg-gray-800 py-4">
        <h2 className="text-2xl font-bold text-center text-white">
          CATÉGORIES
        </h2>
      </div>
      <hr className="border-t-2 border-gray-800 my-1 w-full" />
      <hr className="border-t-2 border-gray-800 mt-4 mb-8 w-full" />
      <div className="flex justify-center gap-8 flex-wrap mb-20">
        {["Romance", "Comédie", "Horreur", "Science-fiction"].map((type) => {
          const filteredMovies = movies.filter(
            (movie) => assignRandomType(movie.id) === type
          );
          return (
            <div
              key={type}
              className="flex flex-col items-center w-1/5 min-w-[100px]"
            >
              <h2 className="text-2xl font-bold text-center my-4">{type}</h2>
              <div className="card flex justify-content-center">
                <Carousel
                  value={filteredMovies}
                  numVisible={1}
                  numScroll={1}
                  orientation="vertical"
                  itemTemplate={moviesTemplate}
                  verticalViewPortHeight="420px"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
