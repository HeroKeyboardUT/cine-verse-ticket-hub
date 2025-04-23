import API_SEAT from "@/lib/API_lib/API_SEAT";

export interface Seat {
  SeatNumber: string;
  roomID: number;
  Price: number;
  status: "available" | "occupied";
  CinemaID: string;
  SeatType: "standard" | "vip";
}

export const fetchSeatsByShowtime = async (
  showtimeId: string
): Promise<Seat[]> => {
  const response = await fetch(
    `${API_SEAT.GET_SEATS_BY_SHOWTIME}/${showtimeId}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch seats for the showtime.");
  }
  const data = await response.json();

  // Ensure Price is properly formatted as a number
  return data.map((seat: any) => ({
    SeatNumber: seat.number,
    roomID: seat.room,
    Price: Number(seat.Price), // Ensure Price is a number, not a string
    status: seat.status,
    CinemaID: seat.cinema,
    SeatType: seat.SeatType?.toLowerCase() || "standard", // Normalize case
  }));
};
