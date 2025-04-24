import VoucherModel from "../models/voucher.model.js";

class VoucherController {
  async getAllVouchers(req, res) {
    try {
      const vouchers = await VoucherModel.getAllVouchers();
      res.status(200).json(vouchers);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving vouchers", error: error.message });
    }
  }
  async getVoucherByCode(req, res) {
    try {
      const code = req.params.code;
      const voucher = await VoucherModel.getVoucherByCode(code);
      res.status(200).json(voucher);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving voucher", error: error.message });
    }
  }

  async getList(req, res) {
    try {
      const vouchers = await VoucherModel.getAllVouchers();
      res.status(200).json(vouchers);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving vouchers", error: error.message });
    }
  }
}

export default new VoucherController();
