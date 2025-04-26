import reportController from "../controllers/report.controller.js";
import authController from "../controllers/auth.controller.js";
import express from "express";

const reportRoute = express.Router();

reportRoute.get("/statistic", authController.verifyToken, authController.verifyAdmin, reportController.getStatisticReport);
reportRoute.get("/revenue/monthly", authController.verifyToken, authController.verifyAdmin, reportController.getMonthlyRevenueReport);
reportRoute.get("/revenue/daily", authController.verifyToken, authController.verifyAdmin, reportController.getDailyRevenueReport);
reportRoute.get("/revenue/movie", authController.verifyToken, authController.verifyAdmin, reportController.getMovieRevenueReport);
reportRoute.get("/topCustomers", authController.verifyToken, authController.verifyAdmin, reportController.getTopCustomerReport);
export default reportRoute;
