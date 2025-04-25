// @/controllers/auth.controller.js
import UserModel from "../models/user.model.js";
import ManagerModel from "../models/manager.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "your-secure-secret";

class AuthController {
  async register(req, res) {
    const { FullName, DateOfBirth, Email, PhoneNumber, MembershipLevel, Password } = req.body;

    // Validate input
    if (!Email || !Password || !FullName) {
      return res.status(400).json({ message: "FullName, Email, and Password are required" });
    }
    if (Password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    try {
      // Check if email already exists
      const existingUser = await UserModel.getCustomerByEmail(Email);
      if (existingUser) {
        return res.status(409).json({ message: "Email already in use" });
      }

      // Create user with plain text password
      await UserModel.createCustomer({
        FullName,
        DateOfBirth,
        Email,
        PhoneNumber,
        MembershipLevel: MembershipLevel || "Standard",
        Password, // Lưu mật khẩu dạng plain text theo yêu cầu
      });

      // Get newly created user
      const user = await UserModel.getCustomerByEmail(Email);
      if (!user) {
        return res.status(500).json({ message: "Failed to retrieve user after creation" });
      }

      // Generate JWT token without expiry
      const token = jwt.sign({ id: user.CustomerID, role: "customer" }, JWT_SECRET);

      return res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
          id: user.CustomerID,
          FullName: user.FullName,
          Email: user.Email,
          MembershipLevel: user.MembershipLevel || "Standard",
        },
      });
    } catch (error) {
      console.error("Error registering user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async login(req, res) {
    const { Email, Password } = req.body;

    // Validate input
    if (!Email || !Password) {
      return res.status(400).json({ message: "Email and Password are required" });
    }

    try {
      // Find user
      const user = await UserModel.getCustomerByEmail(Email);
      if (!user || user.Password !== Password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate JWT token without expiry
      const token = jwt.sign({ id: user.CustomerID, role: "customer" }, JWT_SECRET);

      return res.json({
        message: "Login successful",
        token,
        user: {
          id: user.CustomerID,
          FullName: user.FullName,
          Email: user.Email,
          MembershipLevel: user.MembershipLevel,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async adminLogin(req, res) {
    const { Username, Password } = req.body;

    // Validate input
    if (!Username || !Password) {
      return res.status(400).json({ message: "Username and Password are required" });
    }

    try {
      // Find admin
      const adminUser = await ManagerModel.getMangerByUserName(Username);
      if (!adminUser || adminUser.Password !== Password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      // Generate JWT token without expiry
      const token = jwt.sign({ role: "admin" }, JWT_SECRET);

      return res.json({
        message: "Admin login successful",
        token,
        admin: {
          Username: adminUser.Username,
        },
      });
    } catch (error) {
      console.error("Admin login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async resetPassword(req, res) {
    const { Email, newPassword } = req.body;

    // Validate input
    if (!Email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters long" });
    }

    try {
      // Update password with plain text
      const result = await UserModel.updatePassword(Email, newPassword);
      if (!result) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Password reset error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async verifyToken(req, res, next) {
    try {
      const token = req.headers["authorization"]?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      if (!decoded.role) {
        return res.status(401).json({ message: "Invalid token payload" });
      }

      if (decoded.role === "admin") {
        req.user = { role: "admin"};
        return next();
      }

      if (decoded.role === "customer") {
        const user = await UserModel.getCustomerAuthById(decoded.id);
        if (!user) {
          return res.status(401).json({ message: "Invalid customer user" });
        }
        req.user = { role: "customer", ...user };
        return next();
      }

      return res.status(401).json({ message: "Invalid role in token" });
    } catch (error) {
      console.error("Token verification error:", error);
      if (res.headersSent) {
        console.error("Headers already sent, cannot send another response");
        return;
      }
      return res.status(401).json({ message: "Invalid or malformed token" });
    }
  }

  async verifyAdmin(req, res, next) {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admin only" });
    }
    next();
  }

  async verify(req, res) {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role === "admin") {
      return res.status(200).json({
        message: "Admin verified",
        user: {
          id: req.user.id,
          Username: req.user.Username,
          role: "admin",
        },
      });
    }

    return res.status(200).json({
      message: "User verified",
      user: {
        id: req.user.CustomerID,
        FullName: req.user.FullName,
        Email: req.user.Email,
        MembershipLevel: req.user.MembershipLevel,
        role: "customer",
      },
    });
  }
}

export default new AuthController();