import * as movieService from '../services/movieServices';  
import Movie from '../models/movie';  
import { createMovie, getMovies, getMovieById, updateMovie, deleteMovie } from '../services/movieServices';
import MovieCreationAttributes from '../models/movie';
// Mock du modèle Movie
jest.mock('../models/movie');

describe('createMovie', () => {
    it('should create a movie', async () => {
        const movieData: Partial<Movie> = {
            title: 'Inception',
            description: 'A mind-bending thriller',
            release_date: new Date('1999-03-31'), 
            duration: 145,
        };

        const createdMovie = {
            id: 1,
            ...movieData,
            created_at: new Date(),
            updated_at: new Date(),
        } as Movie;

        (Movie.create as jest.Mock).mockResolvedValue(createdMovie);

        const result = await movieService.createMovie(movieData as MovieCreationAttributes); 
        expect(Movie.create).toHaveBeenCalledWith(movieData);
        expect(result).toEqual(createdMovie);
    });

    describe('getMovies', () => {
        it('should return a list of movies', async () => {
            const movies = [{ id: 1, title: 'Inception' }];

            (Movie.findAll as jest.Mock).mockResolvedValue(movies);

            const result = await getMovies();
            expect(Movie.findAll).toHaveBeenCalled();
            expect(result).toEqual(movies);
        });

        it('should throw an error if fetching movies fails', async () => {
            const errorMessage = 'Error fetching movies';

            (Movie.findAll as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(getMovies()).rejects.toThrow(`Error fetching movies: ${errorMessage}`);
        });
    });

    describe('getMovieById', () => {
        it('should return a movie by ID', async () => {
            const movie = { id: 1, title: 'Inception' };

            (Movie.findByPk as jest.Mock).mockResolvedValue(movie);

            const result = await getMovieById(1);
            expect(Movie.findByPk).toHaveBeenCalledWith(1);
            expect(result).toEqual(movie);
        });

        it('should throw an error if fetching movie by ID fails', async () => {
            const errorMessage = 'Error fetching movie with ID 1';

            (Movie.findByPk as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(getMovieById(1)).rejects.toThrow(`Error fetching movie with ID 1: ${errorMessage}`);
        });
    });

    describe('updateMovie', () => {
        it('should update a movie and return the updated movie', async () => {
            const movieData = { title: 'Inception' };
            const updatedMovie = { id: 1, title: 'Inception', description: 'A mind-bending thriller' };

            (Movie.update as jest.Mock).mockResolvedValue([1]);  
            (Movie.findByPk as jest.Mock).mockResolvedValue(updatedMovie);

            const result = await updateMovie(1, movieData);
            expect(Movie.update).toHaveBeenCalledWith(movieData, { where: { id: 1 } });
            expect(Movie.findByPk).toHaveBeenCalledWith(1);
            expect(result).toEqual(updatedMovie);
        });

        it('should return null if no movie is updated', async () => {
            const movieData = { title: 'Inception' };

            (Movie.update as jest.Mock).mockResolvedValue([0]);  

            const result = await updateMovie(1, movieData);
            expect(result).toBeNull();
        });

        it('should throw an error if updating movie fails', async () => {
            const movieData = { title: 'Inception' };
            const errorMessage = 'Error updating movie with ID 1';

            (Movie.update as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(updateMovie(1, movieData)).rejects.toThrow(`Error updating movie with ID 1: ${errorMessage}`);
        });
    });

    describe('deleteMovie', () => {
        it('should delete a movie and return true', async () => {
            (Movie.destroy as jest.Mock).mockResolvedValue(1);  

            const result = await deleteMovie(1);
            expect(Movie.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toBe(true);
        });

        it('should return false if no movie is deleted', async () => {
            (Movie.destroy as jest.Mock).mockResolvedValue(0);  

            const result = await deleteMovie(1);
            expect(result).toBe(false);
        });

        it('should throw an error if deleting movie fails', async () => {
            const errorMessage = 'Error deleting movie with ID 1';

            (Movie.destroy as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(deleteMovie(1)).rejects.toThrow(`Error deleting movie with ID 1: ${errorMessage}`);
        });
    });
});
