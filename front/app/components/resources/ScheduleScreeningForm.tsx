import * as React from "react";
import { useState } from "react";
import {
  FaFilm,
  FaChair,
  FaCalendarAlt,
  FaClock,
  FaHourglassStart,
} from "react-icons/fa";
import { toast } from "react-toastify";

import {
  HallAttributes,
  MovieAttributes,
  ScreeningAttributes,
} from "../../types/types";

export const ScheduleScreeningForm: React.FC<{
  movies: MovieAttributes[];
  halls: HallAttributes[];
  onSchedule: (screening: ScreeningAttributes) => void;
  existingScreenings: ScreeningAttributes[]; // Prop pour les séances existantes
}> = ({ movies, halls, onSchedule, existingScreenings }) => {
  const [movieId, setMovieId] = useState<number | null>(null);
  const [hallId, setHallId] = useState<number | null>(null);
  const [date, setDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [duration, setDuration] = useState<number>(120);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (movieId && hallId && date && startTime) {
      const screeningDate = new Date(`${date}T${startTime}:00`);

      // Vérifier les règles de planification
      if (!validateScreening(screeningDate, movieId, hallId)) {
        toast.error(
          "La séance ne respecte pas les contraintes de planification."
        );
        return;
      }

      const screening: ScreeningAttributes = {
        movieId,
        hallId,
        date: screeningDate,
        startTime,
        duration,
      };

      // Envoyer la séance au backend via onSchedule
      onSchedule(screening);
      handleSchedule(screening); // Appeler la fonction pour enregistrer la séance dans la base de données
    } else {
      toast.error("Veuillez remplir tous les champs requis.");
    }
  };

  // Fonction de planification de la séance dans la base de données
  const handleSchedule = async (screening: Screening) => {
    try {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movie_id: screening.movieId,
          room_id: screening.hallId,
          date: screening.date.toISOString().split("T")[0],
          heure_debut: screening.startTime,
          heure_fin: calculateEndTime(screening.startTime, screening.duration),
          nb_spectateurs: 0, // Initialise à 0 par défaut
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création de la séance.");
      }

      toast.success("Séance planifiée avec succès !");
    } catch (err) {
      console.error("Erreur lors de la création de la séance :", err);
      toast.error("Erreur lors de la création de la séance.");
    }
  };

  // Fonction de calcul de l'heure de fin
  const calculateEndTime = (startTime: string, duration: number): string => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const endTime = new Date();
    endTime.setHours(hours, minutes);
    endTime.setMinutes(endTime.getMinutes() + duration);
    return endTime.toTimeString().slice(0, 5); // Retourne l'heure de fin au format "HH:MM"
  };

  // Fonction de validation des séances
  const validateScreening = (
    screeningDate: Date,
    movieId: number,
    hallId: number
  ): boolean => {
    const movie = movies.find((m) => m.id === movieId);
    if (!movie) return false;

    const weekNumber = Math.ceil(
      (screeningDate.getTime() - new Date(movie.release_date ?? "").getTime()) /
        (7 * 24 * 60 * 60 * 1000)
    );

    // Vérifier les contraintes selon la semaine
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
    if (!checkTimeInterval(screeningDate, movie.duration ?? 0, hallId)) {
      return false;
    }

    // Vérifier que la séance est programmée entre 10h00 et 23h00
    const screeningEndTime = new Date(screeningDate);
    screeningEndTime.setMinutes(
      screeningEndTime.getMinutes() + (movie.duration ?? 0)
    );
    if (
      screeningDate.getHours() < 10 ||
      screeningEndTime.getHours() > 23 ||
      (screeningEndTime.getHours() === 23 && screeningEndTime.getMinutes() > 0)
    ) {
      return false;
    }

    return true;
  };

  // Fonction pour vérifier le nombre de séances pour un film dans une salle un jour donné
  const getScreeningsCountForDay = (
    screeningDate: Date,
    movieId: number,
    hallId: number
  ): number => {
    return existingScreenings.filter(
      (s) =>
        s.movieId === movieId &&
        s.hallId === hallId &&
        s.date.toDateString() === screeningDate.toDateString()
    ).length;
  };

  // Fonction pour vérifier l'intervalle de temps entre deux séances
  const checkTimeInterval = (
    screeningDate: Date,
    duration: number,
    hallId: number
  ): boolean => {
    const screeningEndTime = new Date(screeningDate);
    screeningEndTime.setMinutes(screeningEndTime.getMinutes() + duration);

    for (const s of existingScreenings) {
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

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="relative">
        <div className="bg-orange-500 absolute top-8 left-2 w-[calc(100%_-_20px)] h-2"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Planifier une nouvelle séance
        </h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="text-gray-900 flex items-center">
            <FaFilm className="text-blue-600 mr-2" /> Film
          </label>
          <select
            className="w-full px-3 py-2 border rounded-md"
            value={movieId || ""}
            onChange={(e) => setMovieId(Number(e.target.value))}
          >
            <option value="">Sélectionnez un film</option>
            {movies.map((movie) => (
              <option key={movie.id} value={movie.id}>
                {movie.title}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className=" text-gray-900 flex items-center">
            <FaChair className="text-green-600 mr-2" /> Salle
          </label>
          <select
            className="w-full px-3 py-2 border rounded-md"
            value={hallId || ""}
            onChange={(e) => setHallId(Number(e.target.value))}
          >
            <option value="">Sélectionnez une salle</option>
            {halls.map((hall) => (
              <option key={hall.id} value={hall.id}>
                {hall.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="text-gray-900 flex items-center">
            <FaCalendarAlt className="text-yellow-500 mr-2" /> Date
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 border rounded-md"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className=" text-gray-900 flex items-center">
            <FaClock className="text-purple-600 mr-2" /> Heure de début
          </label>
          <input
            type="time"
            className="w-full px-3 py-2 border rounded-md"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className=" text-gray-900 flex items-center">
            <FaHourglassStart className="text-red-600 mr-2" /> Durée (minutes)
          </label>
          <input
            type="number"
            className="w-full px-3 py-2 border rounded-md"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            placeholder="Durée en minutes"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-900 text-white rounded-md hover:bg-blue-500"
        >
          Planifier la séance
        </button>
      </form>
    </div>
  );
};
