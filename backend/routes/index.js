
const express = require('express');
const router = express.Router();
const movieRoutes = require('./api/movieRoutes');
const bookingRoutes = require('./api/bookingRoutes');

// API routes
router.use('/api/movies', movieRoutes);
router.use('/api/bookings', bookingRoutes);

// Main route
router.get('/', (req, res) => {
  res.send('Cinema Management API is running');
});

module.exports = router;
