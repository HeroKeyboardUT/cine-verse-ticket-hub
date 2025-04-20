
import { api } from "@/lib/api";

export interface User {
  CustomerID?: string;
  FullName: string;
  DateOfBirth?: string;
  Email: string;
  PhoneNumber?: string;
  MembershipLevel?: string;
  RegistrationDate?: string;
  TotalSpent?: number;
  TotalOrders?: number;
}

export class UserModel {
  static async register(userData: User): Promise<any> {
    try {
      const response = await api.post('/customers', userData);
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  static async login(email: string, password: string): Promise<any> {
    try {
      // In a real app, you would have a proper auth endpoint
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  static async getUserById(id: string): Promise<User> {
    try {
      const response = await api.get(`/customers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw error;
    }
  }
}
