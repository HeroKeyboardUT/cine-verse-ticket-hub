
import { UserModel, User } from "@/models/UserModel";

export class UserController {
  static async register(userData: User): Promise<any> {
    try {
      // Validate user data
      if (!userData.FullName || !userData.Email) {
        throw new Error('Name and email are required');
      }
      
      const response = await UserModel.register(userData);
      return response;
    } catch (error) {
      console.error('Error in UserController.register:', error);
      throw error;
    }
  }

  static async login(email: string, password: string): Promise<any> {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      const response = await UserModel.login(email, password);
      return response;
    } catch (error) {
      console.error('Error in UserController.login:', error);
      throw error;
    }
  }

  static async getUserById(id: string): Promise<User> {
    try {
      const user = await UserModel.getUserById(id);
      return user;
    } catch (error) {
      console.error(`Error in UserController.getUserById with ID ${id}:`, error);
      throw error;
    }
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
