import API_SHOWTIME from "@/lib/API_lib/API_SHOWTIME";

export interface Showtime {
  ShowTimeID: string;
  CinemaID: string;
  CinemaName: string;
  RoomNumber: number;
  RoomType: string;
  MovieID: string;
  MovieTitle: string;
  StartTime: string;
  EndTime: string;
  Duration: number;
  Format: string;
  Subtitle: boolean;
  Dub: boolean;
}

// Fetch all showtimes
export const fetchShowtimes = async (): Promise<Showtime[]> => {
  const response = await fetch(API_SHOWTIME.GET_ALL_SHOWTIMES);
  if (!response.ok) {
    throw new Error("Failed to fetch showtimes");
  }
  return response.json();
};

// Fetch showtimes for a specific movie
export const fetchShowtimeByMovieId = async (
  movieId: string
): Promise<Showtime[]> => {
  const url = API_SHOWTIME.GET_SHOWTIME_BY_ID.replace(":id", movieId);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch showtimes for the movie");
  }
  return response.json();
};

// Create a new showtime
export const createShowtime = async (showtime: Showtime): Promise<void> => {
  const response = await fetch(API_SHOWTIME.CREATE_SHOWTIME, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(showtime),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create showtime");
  }
};

// Update an existing showtime
export const updateShowtime = async (
  id: string,
  showtime: Showtime
): Promise<void> => {
  const url = API_SHOWTIME.UPDATE_SHOWTIME.replace(":id", id);
  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(showtime),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update showtime");
  }
};

// Delete a showtime
export const deleteShowtime = async (id: string): Promise<void> => {
  const url = API_SHOWTIME.DELETE_SHOWTIME.replace(":id", id);
  const response = await fetch(url, { method: "DELETE" });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete showtime");
  }
};

// Fetch occupancy rate for a specific showtime
export const fetchOccupancyRate = async (
  showtimeId: string
): Promise<number> => {
  const url = API_SHOWTIME.GET_OCCUPANCY_RATE.replace(":id", showtimeId);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch occupancy rate");
  }
  const data = await response.json();
  // Extract the value from the returned object
  const key = Object.keys(data)[0];
  return parseFloat(data[key]);
};
