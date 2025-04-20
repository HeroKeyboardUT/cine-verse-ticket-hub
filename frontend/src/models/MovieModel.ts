
import { api } from "@/lib/api";

export interface Movie {
  MovieID: string;
  Title: string;
  ReleaseDate: string;
  Duration: number;
  Language: string;
  Description: string;
  PosterURL: string;
  AgeRating: string;
  Studio: string;
  Country: string;
  Director: string;
  CustomerRating: number;
  Genres: string;
}

export interface ShowTime {
  RoomID: number;
  MovieID: string;
  StartTime: string;
  Duration: number;
  Format: string;
  Subtitle: boolean;
  Dub: boolean;
}

export class MovieModel {
  static async getAllMovies(): Promise<Movie[]> {
    try {
      const response = await api.get('/movies');
      return response.data;
    } catch (error) {
      console.error('Error fetching movies:', error);
      throw error;
    }
  }

  static async getMovieById(id: string): Promise<Movie> {
    try {
      const response = await api.get(`/movies/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching movie with ID ${id}:`, error);
      throw error;
    }
  }

  static async getShowtimes(movieId?: string): Promise<ShowTime[]> {
    try {
      const url = movieId ? `/showtimes?movieId=${movieId}` : '/showtimes';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching showtimes:', error);
      throw error;
    }
  }
}
