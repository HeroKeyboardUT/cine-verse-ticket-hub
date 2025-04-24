// API Urls
import API_ORDER from "../lib/API_lib/API_ORDER";

interface FoodItem {
  itemId: string;
  quantity: number;
}

interface OrderData {
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
  data: OrderData
): Promise<OrderResponse> => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(API_ORDER.CREATE_ORDER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
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
