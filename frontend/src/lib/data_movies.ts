// INTERFACE MOVIE FOR MOVIE
// NOTE : GENRE IS FROM ANOTHER

import API_MOVIES from "./API_lib/API_MOVIES.ts";
import { formatDuration } from "../lib/utils.ts";

export interface Movie {
  id: string;
  title: string;
  releaseDate: string;
  duration?: number;
  language?: string;
  description: string;
  posterUrl?: string;
  ageRating?: string;
  studio?: string;
  country?: string;
  director?: string;
  customerRating?: number;
  genre?: string[];
  backdropUrl?: string;
  isShowing?: boolean;
}

// API
export const fetchMovies = async (): Promise<Movie[]> => {
  try {
    const response = await fetch(API_MOVIES.GET_MOVIES);
    if (!response.ok) {
      throw new Error("Không thể lấy dữ liệu phim từ backend");
    }
    const data = await response.json();

    // Ánh xạ dữ liệu từ MySQL sang giao diện Movie
    const mappedMovies: Movie[] = data.map((movie: any) => ({
      id: movie.MovieID,
      title: movie.Title,
      description: movie.Description || "No description available",
      posterUrl: movie.PosterURL || "https://via.placeholder.com/300x450",
      language: movie.Language,
      backdropUrl:
        "https://images.unsplash.com/photo-1462759353907-b2ea5ebd72e7?q=80&w=2831&auto=format&fit=crop", // Placeholder cho backdropUrl
      customerRating: movie.CustomerRating || 0,
      duration: formatDuration(movie.Duration),
      genre: movie.Genres ? movie.Genres.split(",") : [],
      releaseDate: new Date(movie.ReleaseDate).toISOString().split("T")[0],
      trailerUrl: undefined,
      ageRating: movie.AgeRating || "PG-13",
      studio: movie.Studio || "Unknown Studio",
      country: movie.Country || "Unknown Country",
      director: movie.Director || "Unknown Director",
      isShowing: movie.isShow || false,
    }));
    return mappedMovies;
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    return [];
  }
};

// Lấy phim theo ID (GET /api/movies/:id)
export const fetchMovieById = async (id: string): Promise<Movie> => {
  try {
    const response = await fetch(API_MOVIES.GET_MOVIE_BY_ID.replace(":id", id));
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Không thể lấy phim theo ID");
    }
    const data = await response.json();
    const movie: Movie = {
      id: data.MovieID,
      title: data.Title,
      releaseDate: new Date(data.ReleaseDate).toISOString().split("T")[0],
      language: data.Language,
      duration: formatDuration(data.Duration),
      description: data.Description || "No description available",
      posterUrl: data.PosterURL || "https://via.placeholder.com/300x450",
      ageRating: data.AgeRating || "PG-13",
      studio: data.Studio || "Unknown Studio",
      country: data.Country || "Unknown Country",
      director: data.Director || "Unknown Director",
      customerRating: data.CustomerRating || 0,
      genre: data.Genres ? data.Genres.split(",") : [],
      backdropUrl:
        "https://images.unsplash.com/photo-1462759353907-b2ea5ebd72e7?q=80&w=2831&auto=format&fit=crop", // Placeholder cho backdropUrl
      isShowing: data.isShow || false,
    };
    return movie;
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    throw error;
  }
};

// Tạo phim mới (POST /api/movies)
export const createMovie = async (movie: Movie): Promise<Movie> => {
  try {
    const response = await fetch(API_MOVIES.CREATE_MOVIE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        MovieID: movie.id,
        Title: movie.title,
        ReleaseDate: movie.releaseDate,
        Duration: movie.duration,
        Language: movie.language || null,
        Description: movie.description || null,
        PosterURL: movie.posterUrl || null,
        AgeRating: movie.ageRating || null,
        Studio: movie.studio || null,
        Country: movie.country || null,
        Director: movie.director || null,
        customerRating: movie.customerRating || 0,
        Genres: movie.genre.join(","),
        isShow: movie.isShowing || false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Không thể tạo phim");
    }

    const result = await response.json();
    const newMovie: Movie = {
      id: result.movie.MovieID,
      title: result.movie.Title,
      releaseDate: result.movie.ReleaseDate,
      duration: result.movie.Duration,
      language: movie.language || "",
      description: movie.description || "",
      posterUrl: movie.posterUrl || "",
      ageRating: movie.ageRating || "",
      studio: movie.studio || "",
      country: movie.country || "",
      director: movie.director || "",
      customerRating: movie.customerRating || 0,
      genre: result.movie.Genres
        ? result.movie.Genres.split(",").map((g: string) => g.trim())
        : [],
    };

    return newMovie;
  } catch (error) {
    console.error("Lỗi khi tạo phim:", error);
    throw error;
  }
};

// Cập nhật phim (PUT /api/movies/:id)
export const updateMovie = async (movie: Movie): Promise<Movie> => {
  try {
    const response = await fetch(``, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Title: movie.title,
        ReleaseDate: movie.releaseDate,
        Duration: movie.duration,
        Language: movie.language || null,
        Description: movie.description || null,
        PosterURL: movie.posterUrl || null,
        AgeRating: movie.ageRating || null,
        Studio: movie.studio || null,
        Country: movie.country || null,
        Director: movie.director || null,
        CustomerRating: movie.customerRating || 0,
        Genres: movie.genre.join(","),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Không thể cập nhật phim");
    }

    const result = await response.json();
    const updatedMovie: Movie = {
      id: result.movie.MovieID,
      title: result.movie.Title,
      releaseDate: result.movie.ReleaseDate,
      duration: result.movie.Duration,
      language: movie.language || "",
      description: movie.description || "",
      posterUrl: movie.posterUrl || "",
      ageRating: movie.ageRating || "",
      studio: movie.studio || "",
      country: movie.country || "",
      director: movie.director || "",
      customerRating: movie.customerRating || 0,
      genre: result.movie.Genres
        ? result.movie.Genres.split(",").map((g: string) => g.trim())
        : [],
    };

    return updatedMovie;
  } catch (error) {
    console.error("Lỗi khi cập nhật phim:", error);
    throw error;
  }
};

// Xóa phim (DELETE /api/movies/:id)
export const deleteMovie = async (movieId: string): Promise<void> => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/movies/${movieId}`,
      {
        method: "DELETE",
      }
    );

    console.log("response", response);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Không thể xóa phim");
    }
  } catch (error) {
    console.error("Lỗi khi xóa phim:", error);
    throw error;
  }
};

export const movies: Movie[] = [
  {
    id: "1",
    title: "Galaxy Warriors",
    description:
      "In the far reaches of space, a team of unlikely heroes must unite to save the galaxy from an ancient threat that has reawakened.",
    posterUrl:
      "https://images.unsplash.com/photo-1637858868799-7f26a0640eb6?q=80&w=2940&auto=format&fit=crop",
    backdropUrl:
      "https://images.unsplash.com/photo-1462759353907-b2ea5ebd72e7?q=80&w=2831&auto=format&fit=crop",
    rating: 4.5,
    duration: 135,
    genre: ["Sci-Fi", "Adventure", "Action"],
    releaseDate: "2025-05-15",
    trailerUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: "2",
    title: "Midnight Shadows",
    description:
      "A detective with a troubled past must solve a series of mysterious disappearances in a small town where nothing is as it seems.",
    posterUrl:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2825&auto=format&fit=crop",
    backdropUrl:
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=3274&auto=format&fit=crop",
    rating: 4.2,
    duration: "1h 58m",
    genre: ["Thriller", "Mystery", "Drama"],
    releaseDate: "2025-03-22",
    showtimes: [
      {
        date: "2025-04-10",
        times: ["11:15 AM", "2:30 PM", "5:45 PM", "9:00 PM"],
      },
      {
        date: "2025-04-11",
        times: ["11:15 AM", "2:30 PM", "5:45 PM", "9:00 PM"],
      },
    ],
  },
  {
    id: "3",
    title: "Echoes of Time",
    description:
      "A time traveler becomes trapped between eras and must find a way back to save both past and future from collapsing.",
    posterUrl:
      "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?q=80&w=2835&auto=format&fit=crop",
    backdropUrl:
      "https://images.unsplash.com/photo-1501700493788-fa1a4fc9fe62?q=80&w=3269&auto=format&fit=crop",
    rating: 4.7,
    duration: "2h 30m",
    genre: ["Sci-Fi", "Drama", "Adventure"],
    releaseDate: "2025-02-14",
    showtimes: [
      {
        date: "2025-04-10",
        times: ["10:30 AM", "2:00 PM", "5:30 PM", "9:15 PM"],
      },
      {
        date: "2025-04-11",
        times: ["10:30 AM", "2:00 PM", "5:30 PM", "9:15 PM"],
      },
    ],
  },
  {
    id: "4",
    title: "The Last Kingdom",
    description:
      "In a world torn by war, a young ruler must navigate political intrigue and ancient prophecies to unite the fractured lands.",
    posterUrl:
      "https://images.unsplash.com/photo-1572177191856-3cde618dee1f?q=80&w=2787&auto=format&fit=crop",
    backdropUrl:
      "https://images.unsplash.com/photo-1682687982501-1e58ab814714?q=80&w=3270&auto=format&fit=crop",
    rating: 4.3,
    duration: "2h 22m",
    genre: ["Fantasy", "Action", "Drama"],
    releaseDate: "2025-01-30",
    showtimes: [
      {
        date: "2025-04-10",
        times: ["11:00 AM", "2:45 PM", "6:15 PM", "9:45 PM"],
      },
      {
        date: "2025-04-11",
        times: ["11:00 AM", "2:45 PM", "6:15 PM", "9:45 PM"],
      },
    ],
  },
  {
    id: "5",
    title: "Whispers in the Wind",
    description:
      "A musician discovers she can communicate with spirits through her music, opening a door to the supernatural world.",
    posterUrl:
      "https://images.unsplash.com/photo-1616530940355-351fabd9524b?q=80&w=2785&auto=format&fit=crop",
    backdropUrl:
      "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=3270&auto=format&fit=crop",
    rating: 4.0,
    duration: "1h 52m",
    genre: ["Horror", "Supernatural", "Drama"],
    releaseDate: "2025-04-03",
    showtimes: [
      {
        date: "2025-04-10",
        times: ["12:00 PM", "3:15 PM", "6:30 PM", "9:30 PM"],
      },
      {
        date: "2025-04-11",
        times: ["12:00 PM", "3:15 PM", "6:30 PM", "9:30 PM"],
      },
    ],
  },
  {
    id: "6",
    title: "Ocean's Descent",
    description:
      "A deep-sea research team discovers an ancient civilization beneath the ocean floor, but awakens something that should have remained buried.",
    posterUrl:
      "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2832&auto=format&fit=crop",
    backdropUrl:
      "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?q=80&w=2982&auto=format&fit=crop",
    rating: 3.9,
    duration: "2h 10m",
    genre: ["Adventure", "Horror", "Sci-Fi"],
    releaseDate: "2025-03-10",
    showtimes: [
      {
        date: "2025-04-10",
        times: ["11:45 AM", "2:30 PM", "5:15 PM", "8:45 PM"],
      },
      {
        date: "2025-04-11",
        times: ["11:45 AM", "2:30 PM", "5:15 PM", "8:45 PM"],
      },
    ],
  },
];
