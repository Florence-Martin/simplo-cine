import * as React from "react";
import { useState } from "react";
import {
  FaEdit,
  FaTimes,
  FaChair,
  FaFilm,
  FaCalendarAlt,
  FaInfoCircle,
  FaClock,
  FaTrash,
} from "react-icons/fa";

import { HallAttributes, MovieAttributes } from "../../types/types";

interface MovieViewProps {
  isOpen: boolean;
  onClose: () => void;
  movie: MovieAttributes;
  onModify: (updatedMovie: MovieAttributes) => void;
  onDelete: () => void;
  availableHalls: HallAttributes[]; // Nouvelle prop pour les salles disponibles
  isAdmin: () => boolean;
}

export const MovieView: React.FC<MovieViewProps> = ({
  isOpen,
  onClose,
  movie,
  onModify,
  onDelete,
  availableHalls = [],
  isAdmin,
}) => {
  const [title, setTitle] = useState(movie.title);
  const [description, setDescription] = useState(movie.description || "");

  // Vérifier et convertir la date de sortie en objet Date valide
  const [releaseDate, setReleaseDate] = useState(
    movie.release_date
      ? new Date(movie.release_date).toISOString().substring(0, 10)
      : "" // Défaut à une chaîne vide si release_date est null ou invalide
  );

  const [duration, setDuration] = useState(movie.duration || 0);
  const [selectedHall, setSelectedHall] = useState<number | null>(
    movie.hall?.id || null
  );
  const [isEditing, setIsEditing] = useState(false);

  const handleModify = () => {
    const updatedMovie = {
      ...movie,
      title,
      description,
      release_date: new Date(releaseDate),
      duration,
      hall:
        availableHalls.find((hall) => hall.id === selectedHall) || undefined,
    };
    onModify(updatedMovie);
    setIsEditing(false);
    onClose();
  };

  return isOpen ? (
    <div className="fixed inset-0 z-10 flex items-center justify-center">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75"></div>
      <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-lg w-full relative z-20">
        <div className="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
              <h3
                className="text-lg leading-6 font-medium text-gray-900"
                id="modal-title"
              >
                {isEditing ? "Modifier le film" : "Détails du film"}
              </h3>
              <div className="mt-2">
                <label className="block text-gray-900">
                  <FaFilm className="mr-2 inline-block text-blue-600" /> Titre
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-gray-900"
                  readOnly={!isEditing}
                />
                <label className="block text-gray-900 mt-4">
                  <FaInfoCircle className="mr-2 inline-block text-purple-600" />{" "}
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-gray-900"
                  readOnly={!isEditing}
                ></textarea>
                <label className="block text-gray-900 mt-4">
                  <FaCalendarAlt className="mr-2 inline-block text-red-600" />{" "}
                  Date de sortie
                </label>
                <input
                  type="date"
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-gray-900"
                  readOnly={!isEditing}
                />
                <label className="block text-gray-900 mt-4">
                  <FaClock className="mr-2 inline-block text-yellow-600" />{" "}
                  Durée (en minutes)
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-md text-gray-900"
                  readOnly={!isEditing}
                />
                <label className="block text-gray-900 mt-4">
                  <FaChair className="mr-2 inline-block text-green-600" />
                  Salle de projection
                </label>
                <select
                  value={selectedHall || ""}
                  onChange={(e) => setSelectedHall(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-md text-gray-900"
                  disabled={!isEditing}
                >
                  <option value="">Sélectionnez une salle</option>
                  {availableHalls.map((hall) => (
                    <option key={hall.id} value={hall.id}>
                      {hall.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse">
          {isAdmin() && (
            <>
              {isEditing ? (
                <button
                  onClick={handleModify}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Valider la modification
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm items-center"
                >
                  <FaEdit className="mr-2 text-white" />
                  Modifier
                </button>
              )}
              <button
                onClick={onDelete}
                className="w-full flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm items-center"
              >
                <FaTrash className="mr-2 text-white" />
                Supprimer
              </button>
            </>
          )}

          <button
            onClick={onClose}
            className="mt-3 w-full flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm items-center"
          >
            <FaTimes className="mr-2 text-gray-600" />
            Annuler
          </button>
        </div>
      </div>
    </div>
  ) : null;
};
