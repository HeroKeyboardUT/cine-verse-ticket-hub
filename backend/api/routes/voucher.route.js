import voucherController from "../controllers/voucher.controller.js";
import express from "express";

const voucherRoute = express.Router();

voucherRoute.get("/:code", voucherController.getVoucherByCode);
voucherRoute.get("/", voucherController.getList);

export default voucherRoute;
