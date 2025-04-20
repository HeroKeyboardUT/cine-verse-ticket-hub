
import { CinemaModel, Cinema, Room, Seat } from "@/models/CinemaModel";

export class CinemaController {
  static async getAllCinemas(): Promise<Cinema[]> {
    try {
      const cinemas = await CinemaModel.getAllCinemas();
      return cinemas;
    } catch (error) {
      console.error('Error in CinemaController.getAllCinemas:', error);
      throw error;
    }
  }

  static async getCinemaById(id: string): Promise<Cinema> {
    try {
      const cinema = await CinemaModel.getCinemaById(id);
      return cinema;
    } catch (error) {
      console.error(`Error in CinemaController.getCinemaById with ID ${id}:`, error);
      throw error;
    }
  }

  static async getRoomsByCinemaId(cinemaId: string): Promise<Room[]> {
    try {
      const rooms = await CinemaModel.getRoomsByCinemaId(cinemaId);
      return rooms;
    } catch (error) {
      console.error(`Error in CinemaController.getRoomsByCinemaId with ID ${cinemaId}:`, error);
      throw error;
    }
  }

  static async getSeatsByRoomId(roomId: number, cinemaId: string, showtime?: string): Promise<Seat[]> {
    try {
      const seats = await CinemaModel.getSeatsByRoomId(roomId, cinemaId, showtime);
      return seats.map(seat => ({
        ...seat,
        id: `${seat.CinemaID}-${seat.RoomNumber}-${seat.SeatNumber}`,
        Status: seat.Status || 'available'
      }));
    } catch (error) {
      console.error(`Error in CinemaController.getSeatsByRoomId for room ${roomId}:`, error);
      throw error;
    }
  }

  static getSeatPrice(type: string): number {
    switch (type.toLowerCase()) {
      case 'vip': return 18.99;
      case 'premium': return 15.99;
      default: return 12.99; // 'standard'
    }
  }
}
