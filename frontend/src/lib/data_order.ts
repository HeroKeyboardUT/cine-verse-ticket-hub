import API_ORDER from "./API_lib/API_ORDER";
import { FoodItem } from "./data_food";

export interface Order {
  orderId: string;
  orderDate: string | null;
  status: string;
  totalPrice: number;
  paymentMethod: string;
  isTicket: boolean;
  isFood: boolean;
}

export interface TicketOrderRequest {
  customerId: string;
  showtimeId: string;
  seatNumbers: string[];
  foodItems?: {
    itemId: string;
    quantity: number;
  }[];
  voucherId?: string;
  paymentMethod: "Credit Card" | "Cash" | "Mobile App";
}

export interface OrderResponse {
  orderId: string;
  orderDate: string;
  status: string;
  totalPrice: number;
  paymentMethod: string;
  isTicket: boolean;
  isFood: boolean;
}

export const createTicketOrder = async (
  orderData: TicketOrderRequest
): Promise<OrderResponse> => {
  try {
    const response = await fetch(API_ORDER.CREATE_TICKET_ORDER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create order");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating ticket order:", error);
    throw error;
  }
};

export const getOrderById = async (orderId: string): Promise<OrderResponse> => {
  try {
    const response = await fetch(`${API_ORDER.GET_ORDER_BY_ID}/${orderId}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch order");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};
