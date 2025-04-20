
// server.js
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "", // password: "mysql password"
  database: "CinemaSystem",
});

// Check database connection
db.connect((err) => {
  if (err) {
    console.error("MySQL connection error:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Export database connection for use in controllers
module.exports = db;

// Routes
app.use('/', routes);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
