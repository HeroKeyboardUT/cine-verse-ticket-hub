import API_ORDER from "./API_lib/API_ORDER";

export interface Order {
  orderId: string;
  orderDate: string | null;
  status: string;
  totalPrice: number;
  paymentMethod: string;
  isTicket: boolean;
  isFood: boolean;
}
