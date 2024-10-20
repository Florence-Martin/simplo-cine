// hooks/useScreeningForm.ts
import { useState } from "react";
import { toast } from "react-toastify";

import {
  HallAttributes,
  MovieAttributes,
  ScreeningAttributes,
} from "../types/types";

// Hook personnalisé pour gérer la logique du formulaire de planification des séances
export const useScreeningForm = (
  movies: MovieAttributes[],
  halls: HallAttributes[],
  existingScreenings: ScreeningAttributes[],
  onSchedule: (screening: Omit<ScreeningAttributes, "id">) => void
) => {
  // États pour gérer les données du formulaire
  const [movieId, setMovieId] = useState<number | null>(null);
  const [hallId, setHallId] = useState<number | null>(null);
  const [date, setDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [duration, setDuration] = useState<number>(120);

  // Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (movieId && hallId && date && startTime) {
      const screeningDate = new Date(`${date}T${startTime}:00`);

      // Vérification des règles de planification
      if (!validateScreening(screeningDate, movieId, hallId)) {
        toast.error(
          "La séance ne respecte pas les contraintes de planification."
        );
        return;
      }

      const screening: Omit<ScreeningAttributes, "id"> = {
        movieId,
        hallId,
        date: screeningDate,
        startTime,
        duration,
        endTime: calculateEndTime(startTime, duration),
        spectatorsCount: 0, // Initialisé à 0 par défaut
      };

      // Envoyer la séance via le callback
      onSchedule(screening);
      handleSchedule(screening);
    } else {
      toast.error("Veuillez remplir tous les champs requis.");
    }
  };

  // Fonction pour planifier la séance dans la base de données
  const handleSchedule = async (screening: Omit<ScreeningAttributes, "id">) => {
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
          heure_fin: screening.endTime,
          nb_spectateurs: screening.spectatorsCount,
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

  // Fonction pour calculer l'heure de fin
  const calculateEndTime = (startTime: string, duration: number): string => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const endTime = new Date();
    endTime.setHours(hours, minutes);
    endTime.setMinutes(endTime.getMinutes() + duration);
    return endTime.toTimeString().slice(0, 5); // Format "HH:MM"
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

    // Vérification des règles par semaine
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

    // Vérification du chevauchement
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

  // Fonction pour compter le nombre de séances pour un film dans une salle un jour donné
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

  // Vérification des chevauchements de séances
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

  return {
    movieId,
    setMovieId,
    hallId,
    setHallId,
    date,
    setDate,
    startTime,
    setStartTime,
    duration,
    setDuration,
    handleSubmit,
  };
};
