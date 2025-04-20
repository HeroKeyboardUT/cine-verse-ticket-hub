
import { api } from "@/lib/api";

export interface SeatBooking {
  RoomID: number;
  MovieID: string;
  StartTime: string;
  SeatNumber: number;
  Price: number;
}

export interface Booking {
  Date: string;
  Time: string;
  PaymentMethod: string;
  CustomerID?: string;
  VoucherID?: string;
  Seats: SeatBooking[];
  FoodItems?: FoodOrderItem[];
}

export interface FoodOrderItem {
  ItemID: string;
  Quantity: number;
  Price: number;
}

export interface BookingResponse {
  OrderID: number;
  TotalPrice: number;
  Status: string;
  Message: string;
}

export class BookingModel {
  static async createBooking(booking: Booking): Promise<BookingResponse> {
    try {
      const response = await api.post('/orders', booking);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  static async getBookingsByCustomerId(customerId: string): Promise<any[]> {
    try {
      const response = await api.get(`/customers/${customerId}/orders`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching bookings for customer ${customerId}:`, error);
      throw error;
    }
  }

  static async getFoodAndDrinks(): Promise<any[]> {
    try {
      const response = await api.get('/food-and-drinks');
      return response.data;
    } catch (error) {
      console.error('Error fetching food and drinks:', error);
      throw error;
    }
  }
}
