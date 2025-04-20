
import { BookingModel, Booking, BookingResponse, SeatBooking, FoodOrderItem } from "@/models/BookingModel";
import { Seat } from "@/models/CinemaModel";
import { CinemaController } from "./CinemaController";

export class BookingController {
  static async createBooking(booking: Booking): Promise<BookingResponse> {
    try {
      // Validate booking data
      if (!booking.Date || !booking.Time || !booking.PaymentMethod || booking.Seats.length === 0) {
        throw new Error('Missing required booking information');
      }

      const response = await BookingModel.createBooking(booking);
      return response;
    } catch (error) {
      console.error('Error in BookingController.createBooking:', error);
      throw error;
    }
  }

  static async getBookingsByCustomerId(customerId: string): Promise<any[]> {
    try {
      const bookings = await BookingModel.getBookingsByCustomerId(customerId);
      return bookings;
    } catch (error) {
      console.error(`Error in BookingController.getBookingsByCustomerId for customer ${customerId}:`, error);
      throw error;
    }
  }

  static async getFoodAndDrinks(): Promise<any[]> {
    try {
      const items = await BookingModel.getFoodAndDrinks();
      return items;
    } catch (error) {
      console.error('Error in BookingController.getFoodAndDrinks:', error);
      throw error;
    }
  }

  static calculateTotalPrice(selectedSeats: Seat[], foodItems: FoodOrderItem[] = []): number {
    const seatsTotal = selectedSeats.reduce((total, seat) => {
      return total + CinemaController.getSeatPrice(seat.SeatType);
    }, 0);

    const foodTotal = foodItems.reduce((total, item) => {
      return total + (item.Price * item.Quantity);
    }, 0);

    return Number((seatsTotal + foodTotal).toFixed(2));
  }

  static prepareSeatBookings(
    selectedSeats: Seat[],
    roomId: number,
    movieId: string,
    startTime: string
  ): SeatBooking[] {
    return selectedSeats.map(seat => ({
      RoomID: roomId,
      MovieID: movieId,
      StartTime: startTime,
      SeatNumber: seat.SeatNumber,
      Price: CinemaController.getSeatPrice(seat.SeatType)
    }));
  }
}
