import * as React from "react";
import {
  FaFilm,
  FaChair,
  FaCalendarAlt,
  FaClock,
  FaHourglassStart,
} from "react-icons/fa";

import { useScreeningForm } from "../../hooks/useScreeningForm"; // Importation du hook personnalisé
import {
  HallAttributes,
  MovieAttributes,
  Screening,
  ScreeningAttributes,
} from "../../types/types";

export const ScheduleScreeningForm: React.FC<{
  movies: MovieAttributes[];
  halls: HallAttributes[];
  onSchedule: (screening: Omit<Screening, "id">) => void;
  existingScreenings: ScreeningAttributes[]; // Ajustement du type ici
}> = ({ movies, halls, onSchedule, existingScreenings }) => {
  const {
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
  } = useScreeningForm(movies, halls, existingScreenings, onSchedule);

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
