
import { MovieModel, Movie, ShowTime } from "@/models/MovieModel";

export class MovieController {
  static async getAllMovies(): Promise<Movie[]> {
    try {
      const movies = await MovieModel.getAllMovies();
      return movies;
    } catch (error) {
      console.error('Error in MovieController.getAllMovies:', error);
      throw error;
    }
  }

  static async getMovieById(id: string): Promise<Movie> {
    try {
      const movie = await MovieModel.getMovieById(id);
      return movie;
    } catch (error) {
      console.error(`Error in MovieController.getMovieById with ID ${id}:`, error);
      throw error;
    }
  }

  static async getShowtimes(movieId?: string): Promise<ShowTime[]> {
    try {
      const showtimes = await MovieModel.getShowtimes(movieId);
      return showtimes;
    } catch (error) {
      console.error('Error in MovieController.getShowtimes:', error);
      throw error;
    }
  }

  static formatMovieTime(duration: number): string {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  }

  static getFormattedGenres(genresString: string | undefined): string[] {
    if (!genresString) return [];
    return genresString.split(',').map(genre => genre.trim());
  }
}
