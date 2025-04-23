import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

// JWT Secret Key - Should be in .env file
const JWT_SECRET = process.env.JWT_SECRET || "1234";
// Token expiration time
const TOKEN_EXPIRY = '2h';

class AuthController {
    register(req, res) {
        const { FullName, DateOfBirth, Email, PhoneNumber, MembershipLevel, Password } = req.body;
        // Validate input data
        if (!Email || !Password || !FullName) {
            return res.status(400).json({ message: "Required fields: FullName, Email, password" });
        }
        
        // Hash the password
        const hashedPassword = bcrypt.hashSync(Password, 10);
        
        // Save user to database using model
        UserModel.createCustomer({
            FullName,
            DateOfBirth,
            Email,
            PhoneNumber,
            MembershipLevel,
            password: hashedPassword
        })
        .then(async () => {
            try {
                // Find the newly created user by email to get their ID
                const user = await UserModel.getCustomerByEmail(Email);
                if (!user) {
                    return res.status(500).json({ message: "User created but failed to retrieve user data" });
                }
                
                // Generate JWT token
                const token = jwt.sign({ id: user.CustomerID }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
                res.status(201).json({ 
                    message: "User registered successfully", 
                    token,
                    user: {
                        id: user.CustomerID,
                        FullName: user.FullName,
                        Email: user.Email,
                        MembershipLevel: user.MembershipLevel || "Standard"
                    }
                });
            } catch (error) {
                console.error("Error retrieving user after creation:", error);
                res.status(500).json({ message: "User created but failed to generate token" });
            }
        })
        .catch((error) => {
            console.error("Error registering user:", error);
            if (error.message.includes("Duplicate entry") && error.message.includes("Email")) {
                return res.status(409).json({ message: "Email already in use" });
            }
            res.status(500).json({ message: "Internal server error" });
        });
    }
    
    login(req, res) {
        const { Email, Password } = req.body;
        
        if (!Email || !Password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        
        // Find user by email using model
        UserModel.getCustomerByEmail(Email)
            .then((user) => {
                if (!user) {
                    return res.status(401).json({ message: "Invalid email or password" });
                }
                
                // Compare passwords
                const isPasswordValid = bcrypt.compareSync(Password, user.Password);
                
                if (!isPasswordValid) {
                    return res.status(401).json({ message: "Invalid email or password" });
                }
                
                // Generate JWT token
                const token = jwt.sign({ id: user.CustomerID }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
                
                // Return user data and token
                res.json({
                    message: "Login successful",
                    token,
                    user: {
                        id: user.CustomerID,
                        FullName: user.FullName,
                        Email: user.Email,
                        MembershipLevel: user.MembershipLevel
                    }
                });
            })
            .catch(error => {
                console.error("Login error:", error);
                res.status(500).json({ message: "Internal server error" });
            });
    }

    
    resetPassword(req, res) {
        const { Email, newPassword } = req.body;
        
        if (!Email || !newPassword) {
            return res.status(400).json({ message: "Email and new password are required" });
        }
        
        // Hash the new password
        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        
        // Update password in database using model
        UserModel.updatePassword(Email, hashedPassword)
            .then(() => {
                res.json({ message: "Password reset successfully" });
            })
            .catch(error => {
                console.error("Password reset error:", error);
                if (error.message === "User not found") {
                    return res.status(404).json({ message: "User not found" });
                }
                res.status(500).json({ message: "Internal server error" });
            });
    }
    
    verifyToken(req, res, next) {
        // Check if token is provided in headers
        
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }
        
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.userId = decoded.id;
            
            // Verify user exists (optional)
            UserModel.getCustomerAuthById(req.userId)
                .then(user => {
                    if (!user) {
                        return res.status(401).json({ message: "Invalid user" });
                    }
                    // Add user information to request
                    req.user = user;
                    req.user.MembershipLevel = user.MembershipLevel || "Standard";
                    next();
                })
                .catch(error => {
                    console.error("User verification error:", error);
                    return res.status(500).json({ message: "Internal server error" });
                });
        } catch (error) {
            console.error("Token verification error:", error);
            return res.status(401).json({ message: "Invalid or expired token" });
        }
    }
    
    // New endpoint to verify token for frontend
    verify(req, res) {
        // The token verification already happened in the verifyToken middleware
        // We just need to return success if we reach this point
        res.status(200).json({ 
            verified: true, 
            user: {
                id: req.user.CustomerID,
                name: req.user.FullName,
                email: req.user.Email,
                membershipLevel: req.user.MembershipLevel
            } 
        });
    }

    verifyAdmin(req, res, next) {
        if (!req.user || req.user.MembershipLevel !== "Admin") {
            return res.status(403).json({ message: "Access denied" });
        }
        next();
    }
}

export default new AuthController();