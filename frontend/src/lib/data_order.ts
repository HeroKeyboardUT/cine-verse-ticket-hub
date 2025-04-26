// API Urls
import API_ORDER from "../lib/API_lib/API_ORDER";

export interface FoodItem {
  itemId: string;
  quantity: number;
}
export interface TicketItem {
  showtimeId: string;
  movieId: string;
  roomNumber: string;
  seatNumber: string;
  price: number;
}

export interface OrderData {
  customerId: string;
  showtimeId: string;
  movieId: string;
  seatNumbers: string[];
  foodItems?: FoodItem[];
  voucherId?: string;
  paymentMethod: string;
  totalPrice: number;
}

export interface OrderResponse {
  orderId: string;
  message: string;
}

export interface Order {
  OrderID: string;
  OrderDate: string;
  Status: string;
  TotalPrice: number;
  PaymentMethod: string;
  isTicket: boolean;
  isFood: boolean;
  VoucherID?: string;
  CustomerID?: string;

  // Movie-related info
  MovieTitle?: string;
  PosterURL?: string;
  StartTime?: string;
  EndTime?: string;
  Format?: string;
  Subtitle?: boolean;
  Dub?: boolean;
  CinemaName?: string;
  CinemaLocation?: string;
  RoomNumber?: string;
  SeatType?: string;
  RoomType?: string;
  SeatNumber?: string;
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
        Authorization: `Bearer ${token}`,
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

export const fetchUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `${API_ORDER.GET_USER_ORDERS.replace(":id", userId)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch orders");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }
};

export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `${API_ORDER.GET_ORDER_BY_ID.replace(":id", orderId)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch order details");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching order details:", error);
    return null;
  }
};
export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(API_ORDER.GET_ALL_ORDERS, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch orders");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching all orders:", error);
    return [];
  }
};
export const getTicketOrderById = async (
  orderId: string
): Promise<TicketItem[] | null> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `${API_ORDER.GET_TICKET_ORDER_BY_ID.replace(":id", orderId)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch ticket order");
    }
    const data = await response.json();
    return data.map((ticket: any) => ({
      showtimeId: ticket.ShowTimeID,
      movieId: ticket.MovieID,
      roomNumber: ticket.RoomNumber,
      seatNumber: ticket.SeatNumber,
      price: ticket.Price,
    }));
  } catch (error) {
    console.error("Error fetching ticket order:", error);
    return null;
  }
};
export const getFoodOrderById = async (
  orderId: string
): Promise<FoodItem[] | null> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `${API_ORDER.GET_FOOD_ORDER_BY_ID.replace(":id", orderId)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch food order");
    }

    const data = await response.json();
    return data.map((food: any) => ({
      itemId: food.ItemID,
      quantity: food.Quantity,
    }));
  } catch (error) {
    console.error("Error fetching food order:", error);
    return null;
  }
};

export const updateOrderStatus = async (
  orderId: string,
  status: string
): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(
      `${API_ORDER.UPDATE_ORDER_STATUS.replace(":id", orderId)}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update order status");
    }
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};
