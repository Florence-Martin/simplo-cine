import * as React from "react";
import { useState } from "react";
import {
  FaAlignLeft,
  FaCalendarAlt,
  FaHeading,
  FaHourglassStart,
  FaImage,
  FaPlus,
} from "react-icons/fa";

import { MovieAttributes } from "../../types/types";

interface AddMovieCardProps {
  onAddMovie: (newMovie: MovieAttributes) => void;
}

export const AddMovieCard: React.FC<AddMovieCardProps> = ({ onAddMovie }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [releaseDate, setReleaseDate] = useState<Date | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [poster, setPoster] = useState<File | null>(null);

  const handleAdd = () => {
    if (title && releaseDate && duration) {
      const newMovie: MovieAttributes = {
        id: Math.floor(Math.random() * 10000),
        title,
        description,
        release_date: releaseDate,
        duration,
        created_at: new Date(),
        updated_at: new Date(),
        poster,
      };
      onAddMovie(newMovie);
      setTitle("");
      setDescription("");
      setReleaseDate(null);
      setDuration(null);
      setPoster(null); // Réinitialiser le formulaire
    } else {
      alert("Veuillez remplir tous les champs requis.");
    }
  };

  const handlePosterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPoster(e.target.files[0]);
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="relative">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 flex items-center relative z-10">
          Ajouter un nouveau film
        </h2>
        <div className="bg-orange-500 absolute top-8 left-2 w-[calc(100%_-_20px)] h-2"></div>
      </div>
      <div className="mb-4">
        <label className="text-gray-900 flex items-center">
          <FaHeading className="text-green-600 mr-2" /> Titre
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre du film"
        />
      </div>
      <div className="mb-4">
        <label className="text-gray-900 flex items-center">
          <FaAlignLeft className="text-purple-600 mr-2" /> Description
        </label>
        <textarea
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description du film"
        ></textarea>
      </div>

      <div className="mb-4">
        <label className="text-gray-900 flex items-center">
          <FaCalendarAlt className="text-yellow-500 mr-2" /> Date de sortie
        </label>
        <input
          type="date"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          onChange={(e) => setReleaseDate(e.target.valueAsDate)}
        />
      </div>
      <div className="mb-4">
        <label className="text-gray-900 flex items-center">
          <FaHourglassStart className="text-orange-600 mr-2" /> Durée (en
          minutes)
        </label>
        <input
          type="number"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          value={duration !== null ? duration : ""}
          onChange={(e) => setDuration(Number(e.target.value))}
          placeholder="Durée en minutes"
        />
      </div>
      <div className="mb-4">
        <label className="text-gray-900 flex items-center">
          <FaImage className="text-teal-600 mr-2" /> Affiche du film
        </label>
        <input
          type="file"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
          accept="image/*"
          onChange={handlePosterUpload}
        />
      </div>
      <button
        onClick={handleAdd}
        className="w-full py-2 bg-blue-900 text-white rounded-md hover:bg-blue-500 flex items-center justify-center"
      >
        <FaPlus className="mr-2" /> Ajouter le film
      </button>
    </div>
  );
};
