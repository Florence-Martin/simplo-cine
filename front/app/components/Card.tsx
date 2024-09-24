"use client";

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, TransitionChild } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import * as React from "react";
import { useState } from "react";
import { FaEye } from "react-icons/fa";



import MovieImage from "./MovieImage";
import { MovieView } from "./resources/MovieView";

interface MovieAttributes {
  id: number;
  title: string;
  description?: string;
  release_date?: Date;
  duration?: number;
}

interface CardProps {
  id: number;
  title: string;
  description?: string;
  type: string;
  release_date?: string;
  duration?: number;
  created_at: string;
  updated_at: string;
  iconDisabled?: boolean;
  isAdmin: () => boolean;
  onModify?: (updatedMovie: MovieAttributes) => Promise<void>;
  onDelete?: (movieId: number) => void;
}

const Card: React.FC<CardProps> = ({
  id,
  title,
  description,
  type,
  release_date,
  duration,
  created_at,
  updated_at,
  isAdmin,
  onModify,
  onDelete,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<MovieAttributes | null>(
    null
  );

  const [open, setOpen] = useState(false);

  const decodeHtmlEntities = (text: string): string => {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = text;
    return textArea.value;
  };

  const handleSelectEvent = () => {
    const movie = {
      id,
      title,
      description,
      type,
      release_date: release_date ? new Date(release_date) : undefined,
      duration,
      created_at: new Date(created_at),
      updated_at: new Date(updated_at),
      poster: null,
    };
    setSelectedMovie(movie);
    setOpen(true)
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  const handleModifyMovie = (updatedMovie: MovieAttributes) => {
    if (onModify) {
      onModify(updatedMovie);
    }
    handleCloseModal();
  };

  const handleDeleteMovie = () => {
    if (selectedMovie) {
      if (onDelete) {
        onDelete(selectedMovie.id);
      }
      handleCloseModal();
    }
  };

  const assignImageByType = (type: string): string => {
    switch (type) {
      case "Romance":
        return "/romance.png";
      case "Comédie":
        return "/comedie.png";
      case "Horreur":
        return "/horreur.png";
      case "Science-fiction":
        return "/scienceFiction.png";
      default:
        return "/testMovieImage.png";
    }
  };


  return (
    <>


      <div className="flex justify-center items-center h-screen">
        <div className="max-w-sm rounded overflow-hidden shadow-lg">
          <MovieImage
            className="w-auto h-60"
            src={assignImageByType(type)}
            alt={`${title} poster`}
          />
          <div className="icons text-gray-700 flex justify-end space-x-2 p-2">
            <button
              className="inline-block flex items-center space-x-1 bg-green-700 rounded-l-full rounded-r-none px-3 py-1 text-white"
              onClick={handleSelectEvent}
            >
              <FaEye className="mx-2" />
              <span>En savoir plus</span>
            </button>
          </div>
          <div className="px-6 py-4">
            <h3 className="text-xl text-gray-700 font-bold mb-2">
              {decodeHtmlEntities(title.toUpperCase())}
            </h3>
            {isAdmin() && (
              <>
                <h4 className="text-gray-700 text-base font-semibold mb-2">
                  Description
                </h4>
                {description && (
                  <p className="text-gray-700 text-base">
                    {decodeHtmlEntities(description)}
                  </p>
                )}
              </>
            )}


            <div className="flex flex-wrap">
              <div className="w-1/2">
                <h4 className="text-gray-700 text-base font-semibold mb-2">
                  Date de sortie
                </h4>
                <p className="text-gray-700 text-base">
                  {release_date
                    ? new Date(release_date).toLocaleDateString()
                    : "Date non disponible"}
                </p>
              </div>
              <div className="w-1/2">
                <h4 className="text-gray-700 text-base font-semibold mb-2">
                  Durée
                </h4>
                {duration !== undefined && (
                  <p className="text-gray-700 text-base">{duration} min</p>
                )}
              </div>
            </div>


            {isAdmin() && (
              <>
                <p className="text-gray-700 text-base">
                  {new Date(created_at).toLocaleDateString()}
                </p>
                <p className="text-gray-700 text-base">
                  {new Date(updated_at).toLocaleDateString()}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
        />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <DialogPanel
                transition
                className="pointer-events-auto relative w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
              >
                <TransitionChild>
                  <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 duration-500 ease-in-out data-[closed]:opacity-0 sm:-ml-10 sm:pr-4">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                    >
                      <span className="absolute -inset-2.5" />
                      <span className="sr-only">Close panel</span>
                      <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                    </button>
                  </div>
                </TransitionChild>
                <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                  <div className="px-4 sm:px-6">
                    <DialogTitle className="text-base font-semibold leading-6 text-gray-900 mb-4">
                      <h3 className="text-xl text-gray-700 font-bold mb-2">
                        {decodeHtmlEntities(title.toUpperCase())}
                      </h3>
                    </DialogTitle>
                    <MovieImage
                      className="w-auto h-60"
                      src={assignImageByType(type)}
                      alt={`${title} poster`}
                    />
                    <div className="flex space-x-4 my-6">
                      <div className="w-1/2">
                        <h4 className="text-gray-700 text-base font-semibold">
                          Durée :
                        </h4>
                        {duration !== undefined && (
                          <p className="text-gray-700 text-base">{duration} min</p>
                        )}
                      </div>
                      <div className="w-1/2">
                        <h4 className="text-gray-700 text-base font-semibold">
                          Date de sortie :
                        </h4>
                        <p className="text-gray-700 text-base">
                          {release_date ? new Date(release_date).toLocaleDateString() : "Date non disponible"}
                        </p>
                      </div>
                    </div>
                    <h4 className="text-gray-700 text-base font-semibold mb-2">
                      Description
                    </h4>
                    {description && (
                      <p className="text-gray-700 text-base">
                        {decodeHtmlEntities(description)}
                      </p>
                    )}
                    <div className="icons text-gray-700 flex justify-end space-x-2 p-2">
                      <span className="flex bg-gray-200 rounded-l-full rounded-r-none px-3 py-1 text-sm font-semibold text-gray-700">
                        # {type}
                      </span>
                    </div>
                  </div>
                  <div className="relative mt-6 flex-1 px-4 sm:px-6">{/* Your content */}</div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>


      {selectedMovie && (
        <MovieView
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          movie={selectedMovie}
          onModify={handleModifyMovie}
          onDelete={handleDeleteMovie}
          availableHalls={[]}
          isAdmin={isAdmin}
        />
      )}
    </>
  );
};

export default Card;
