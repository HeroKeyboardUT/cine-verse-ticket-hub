import voucherController from '../controllers/voucher.controller.js';
import express from 'express';

route = express.Router();

route.get('/:code', voucherController.getVoucherByCode);
route.get('/', voucherController.getList);


export default route;