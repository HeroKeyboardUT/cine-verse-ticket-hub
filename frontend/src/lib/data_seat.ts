export interface Seat {
  id: string;
  row: string;
  number: number;
  status: "available" | "occupied" | "selected";
  type: "standard" | "premium" | "vip";
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
