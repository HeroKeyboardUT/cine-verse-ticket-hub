// API Urls
import API_ORDER from "../lib/API_lib/API_ORDER";

interface FoodItem {
  itemId: string;
  quantity: number;
}

interface TicketOrderData {
  customerId: string;
  showtimeId: string;
  movieId: string;
  seatNumbers: string[];
  foodItems?: FoodItem[];
  voucherId?: string;
  paymentMethod: string;
  totalPrice: number;
}

interface OrderResponse {
  orderId: string;
  message: string;
}

export const createTicketOrder = async (
  data: TicketOrderData
): Promise<OrderResponse> => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(API_ORDER.CREATE_TICKET_ORDER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        customerId: data.customerId,
        roomId: data.showtimeId.split("-")[0], // Assuming the showtimeId contains roomId
        movieId: data.movieId,
        startTime: new Date().toISOString(), // You may need to get this from the showtime data
        seats: data.seatNumbers,
        totalPrice: data.totalPrice,
        status: "Booked",
        paymentMethod: data.paymentMethod,
        foodItems: data.foodItems,
        voucherId: data.voucherId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create order");
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error creating ticket order:", error);
    throw error;
  }
};
