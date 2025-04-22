import API_SEAT from "@/lib/API_lib/API_SEAT";

export interface Seat {
  SeatNumber: string;
  roomID: number;
  Price: number;
  status: "available" | "occupied";
  CinemaID: string;
  SeatType: "standard" | "vip";
}

export const generateSeats = (showtime: string): Seat[] => {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const seatsPerRow = 12;
  const seats: Seat[] = [];

  rows.forEach((row) => {
    for (let i = 1; i <= seatsPerRow; i++) {
      // Generate random status for demo purposes
      const random = Math.random();
      let status: "available" | "occupied" | "selected" = "available";

      if (random < 0.2) {
        status = "occupied";
      }

      // Determine seat type
      let type: "standard" | "premium" | "vip" = "standard";
      if (row === "G" || row === "H") {
        type = "premium";
      }
      if (row === "D" || row === "E") {
        type = "vip";
      }

      seats.push({
        id: `${row}${i}`,
        row,
        number: i,
        status,
        type,
      });
    }
  });

  return seats;
};

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
  // console.log("Fetched seats data:", data); // Debugging line
  return data.map((seat: any) => ({
    SeatNumber: seat.SeatNumber,
    roomID: seat.roomID,
    Price: seat.Price,
    status: seat.status,
    CinemaID: seat.CinemaID,
    SeatType: seat.SeatType,
  }));
};
