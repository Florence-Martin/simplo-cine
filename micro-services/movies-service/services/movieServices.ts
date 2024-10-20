import Movie from '../models/movie';
import MovieCreationAttributes from "../models/movie";
import MovieAttributes from "../models/movie";



// Créer un film
export const createMovie = async (data: MovieCreationAttributes): Promise<MovieAttributes> => {
  try {
    const movie = await Movie.create(data);
    return movie;
  } catch (err) {
    throw new Error(`Error creating movie: ${(err as Error).message}`);
  }
};

// Obtenir tous les films
export const getMovies = async (): Promise<MovieAttributes[]> => {
  try {
    return await Movie.findAll();
  } catch (err) {
    throw new Error(`Error fetching movies: ${(err as Error).message}`);
  }
};

// Obtenir un film par ID
export const getMovieById = async (id: number): Promise<MovieAttributes | null> => {
  try {
    return await Movie.findByPk(id);
  } catch (err) {
    throw new Error(`Error fetching movie with ID ${id}: ${(err as Error).message}`);
  }
};

// Mettre à jour un film
export const updateMovie = async (id: number, data: Partial<MovieAttributes>): Promise<MovieAttributes | null> => {
  try {
    const [updated] = await Movie.update(data, { where: { id } });
    if (updated) {
      return await Movie.findByPk(id);
    }
    return null;
  } catch (err) {
    throw new Error(`Error updating movie with ID ${id}: ${(err as Error).message}`);
  }
};

// Supprimer un film
export const deleteMovie = async (id: number): Promise<boolean> => {
  try {
    const deleted = await Movie.destroy({ where: { id } });
    return deleted > 0;
  } catch (err) {
    throw new Error(`Error deleting movie with ID ${id}: ${(err as Error).message}`);
  }
};
