import API_USER from "./API_lib/API_USER";
import { Order } from "./data_order";
export interface User {
  id: string;
  FullName: string;
  email: string;
  role: string;
  dateOfBirth: string | null;
  phoneNumber: string | null;
  membershipLevel: string;
  registrationDate: string | null;
  totalSpent: number;
  totalOrders: number;
}

export const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch(API_USER.GET_ALL_USERS);
  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
  }
  const data = await response.json();
  return data.map((user: any) => ({
    id: user.CustomerID,
    FullName: user.FullName,
    email: user.Email,
    role: user.MembershipLevel === "VIP" ? "VIP" : "Customer",
    dateOfBirth: user.DateOfBirth || null,
    phoneNumber: user.PhoneNumber || null,
    membershipLevel: user.MembershipLevel || "Standard",
    registrationDate: user.RegistrationDate || null,
    totalSpent: parseFloat(user.TotalSpent) || 0,
    totalOrders: parseInt(user.TotalOrders) || 0,
  }));
};

export const fetchUserById = async (id: string): Promise<User | null> => {
  const response = await fetch(`${API_USER.GET_ALL_USERS}/${id}`);
  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
  }
  const data = await response.json();
  return {
    id: data.CustomerID,
    FullName: data.FullName,
    email: data.Email,
    role: data.MembershipLevel === "VIP" ? "VIP" : "Customer",
    dateOfBirth: data.DateOfBirth || null,
    phoneNumber: data.PhoneNumber || null,
    membershipLevel: data.MembershipLevel || "Standard",
    registrationDate: data.RegistrationDate || null,
    totalSpent: parseFloat(data.TotalSpent) || 0,
    totalOrders: parseInt(data.TotalOrders) || 0,
  };
};

export const createUser = async (user: Partial<User>): Promise<void> => {
  const response = await fetch(API_USER.CREATE_USER, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to create user");
  }
};

export const updateUser = async (
  id: string,
  user: Partial<User>
): Promise<void> => {
  const url = API_USER.UPDATE_USER.replace(":id", id);
  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update user");
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  const url = API_USER.DELETE_USER.replace(":id", id);
  const response = await fetch(url, { method: "DELETE" });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete user");
  }
};

export const fetchUserOrders = async (userId: string): Promise<Order[]> => {
  const url = `${API_USER.GET_ALL_USERS}/${userId}/orders`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch user orders");
  }
  const data = await response.json();
  return data.map((order: any) => ({
    orderId: order.OrderID,
    orderTime: order.OrderDate || null,
    status: order.Status,
    totalPrice: parseFloat(order.TotalPrice) || 0,
    paymentMethod: order.PaymentMethod,
    isTicket: order.IsTicket,
    isFood: order.IsFood,
  }));
};
