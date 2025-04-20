
import { api } from "@/lib/api";

export interface Cinema {
  CinemaID: string;
  Name: string;
  OpeningHours: string;
  ClosingHours: string;
  Location: string;
  PhoneNumbers: string[];
}

export interface Room {
  RoomNumber: number;
  CinemaID: string;
  Capacity: number;
  Type: string;
  ScreenID: number;
}

export interface Seat {
  SeatNumber: number;
  RoomNumber: number;
  CinemaID: string;
  SeatType: string;
  Status?: 'available' | 'occupied' | 'selected';
  Price?: number;
  id?: string;
}

export class CinemaModel {
  static async getAllCinemas(): Promise<Cinema[]> {
    try {
      const response = await api.get('/cinemas');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching cinemas:', error);
      throw error;
    }
  }

  static async getCinemaById(id: string): Promise<Cinema> {
    try {
      const response = await api.get(`/cinemas/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching cinema with ID ${id}:`, error);
      throw error;
    }
  }

  static async getRoomsByCinemaId(cinemaId: string): Promise<Room[]> {
    try {
      const response = await api.get(`/rooms?cinemaId=${cinemaId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching rooms for cinema ${cinemaId}:`, error);
      throw error;
    }
  }

  static async getSeatsByRoomId(roomId: number, cinemaId: string, showtime?: string): Promise<Seat[]> {
    try {
      let url = `/seats?roomId=${roomId}&cinemaId=${cinemaId}`;
      if (showtime) {
        url += `&showtime=${showtime}`;
      }
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error(`Error fetching seats for room ${roomId}:`, error);
      throw error;
    }
  }
}
