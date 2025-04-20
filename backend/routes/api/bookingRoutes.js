
const express = require('express');
const router = express.Router();
const bookingController = require('../../controllers/bookingController');

// POST create new booking
router.post('/', bookingController.createBooking);

// GET bookings by customer ID
router.get('/customer/:customerId', bookingController.getBookingsByCustomerId);

// GET booking by order ID
router.get('/:orderId', bookingController.getBookingById);

// GET available food and drinks
router.get('/food-and-drinks', bookingController.getFoodAndDrinks);

module.exports = router;
