
const db = require('../config/database');

// Helper function to handle database queries
const queryAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (error, results) => {
      if (error) reject(error);
      else resolve(results);
    });
  });
};

// Create a new booking
exports.createBooking = async (req, res, next) => {
  let connection;
  
  try {
    const {
      Date: bookingDate,
      Time: bookingTime,
      PaymentMethod,
      CustomerID,
      VoucherID,
      Seats,
      FoodItems
    } = req.body;

    // Validate required fields
    if (!bookingDate || !bookingTime || !PaymentMethod || !Seats || Seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required booking information"
      });
    }

    // Start transaction
    connection = await db.promise().getConnection();
    await connection.beginTransaction();

    // Calculate total price
    let totalPrice = 0;
    
    // Add seat prices
    for (const seat of Seats) {
      totalPrice += seat.Price;
    }
    
    // Add food prices if any
    if (FoodItems && FoodItems.length > 0) {
      for (const item of FoodItems) {
        totalPrice += item.Price * item.Quantity;
      }
    }
    
    // Apply voucher discount if provided
    if (VoucherID) {
      // Get voucher details
      const voucher = await queryAsync(
        "SELECT DiscountAmount, DiscountType FROM VOUCHER WHERE VoucherID = ? AND IsActive = TRUE",
        [VoucherID]
      );
      
      if (voucher.length > 0) {
        if (voucher[0].DiscountType === '%') {
          totalPrice = totalPrice * (1 - voucher[0].DiscountAmount / 100);
        } else {
          totalPrice = Math.max(0, totalPrice - voucher[0].DiscountAmount);
        }
        
        // Update voucher usage
        await connection.query(
          "UPDATE VOUCHER SET UsedCount = UsedCount + 1 WHERE VoucherID = ?",
          [VoucherID]
        );
      }
    }
    
    // Round to 2 decimal places
    totalPrice = Math.round(totalPrice * 100) / 100;

    // Create order
    const [orderResult] = await connection.query(
      `INSERT INTO \`ORDER\` (Date, Time, Status, PaymentMethod, TotalPrice, VoucherID, CustomerID, isTicket, isFood)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        bookingDate, 
        bookingTime, 
        'Completed', 
        PaymentMethod, 
        totalPrice, 
        VoucherID || null, 
        CustomerID || null,
        Seats.length > 0 ? 1 : 0,
        FoodItems && FoodItems.length > 0 ? 1 : 0
      ]
    );

    const orderId = orderResult.insertId;

    // Book seats
    for (const seat of Seats) {
      await connection.query(
        `INSERT INTO SHOWTIME_SEAT (RoomID, MovieID, StartTime, SeatNumber, Status, OrderID, Price)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          seat.RoomID,
          seat.MovieID,
          seat.StartTime,
          seat.SeatNumber,
          'Booked',
          orderId,
          seat.Price
        ]
      );
    }

    // Add food items if any
    if (FoodItems && FoodItems.length > 0) {
      for (const item of FoodItems) {
        await connection.query(
          `INSERT INTO FOOD_DRINK_ORDER (ItemID, OrderID, Quantity)
           VALUES (?, ?, ?)`,
          [item.ItemID, orderId, item.Quantity]
        );
      }
    }

    // Update customer stats if customer ID provided
    if (CustomerID) {
      await connection.query(
        `UPDATE CUSTOMER 
         SET TotalSpent = TotalSpent + ?, TotalOrders = TotalOrders + 1
         WHERE CustomerID = ?`,
        [totalPrice, CustomerID]
      );
    }

    // Commit transaction
    await connection.commit();
    
    res.status(201).json({
      success: true,
      message: "Booking successful",
      OrderID: orderId,
      TotalPrice: totalPrice,
      Status: "Completed"
    });
  } catch (error) {
    // Rollback transaction if error
    if (connection) {
      await connection.rollback();
    }
    next(error);
  } finally {
    // Release connection
    if (connection) {
      connection.release();
    }
  }
};

// Get bookings by customer ID
exports.getBookingsByCustomerId = async (req, res, next) => {
  try {
    const { customerId } = req.params;
    
    const query = `
      SELECT 
        o.OrderID, 
        o.Date, 
        o.Time, 
        o.Status, 
        o.TotalPrice, 
        o.PaymentMethod,
        m.Title as MovieTitle,
        GROUP_CONCAT(DISTINCT CONCAT('Row ', ss.SeatNumber)) as Seats
      FROM \`ORDER\` o
      LEFT JOIN SHOWTIME_SEAT ss ON o.OrderID = ss.OrderID
      LEFT JOIN MOVIE m ON ss.MovieID = m.MovieID
      WHERE o.CustomerID = ?
      GROUP BY o.OrderID
      ORDER BY o.Date DESC, o.Time DESC
    `;
    
    const bookings = await queryAsync(query, [customerId]);
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

// Get available food and drinks
exports.getFoodAndDrinks = async (req, res, next) => {
  try {
    const query = `
      SELECT 
        fd.*, 
        p.Flavour, 
        d.Size
      FROM FOOD_AND_DRINK fd
      LEFT JOIN POPCORN p ON fd.ItemID = p.ItemID
      LEFT JOIN DRINK d ON fd.ItemID = d.ItemID
      WHERE fd.IsAvailable = TRUE
      ORDER BY fd.Name
    `;
    
    const items = await queryAsync(query);
    res.status(200).json(items);
  } catch (error) {
    next(error);
  }
};

// Get booking by ID
exports.getBookingById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    
    const orderQuery = `
      SELECT 
        o.OrderID, 
        o.Date, 
        o.Time, 
        o.Status, 
        o.TotalPrice, 
        o.PaymentMethod,
        c.FullName as CustomerName,
        c.Email as CustomerEmail
      FROM \`ORDER\` o
      LEFT JOIN CUSTOMER c ON o.CustomerID = c.CustomerID
      WHERE o.OrderID = ?
    `;
    
    const orders = await queryAsync(orderQuery, [orderId]);
    
    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }
    
    const order = orders[0];
    
    // Get ticket details
    const ticketsQuery = `
      SELECT 
        ss.RoomID,
        ss.MovieID,
        ss.SeatNumber,
        ss.Price,
        m.Title as MovieTitle
      FROM SHOWTIME_SEAT ss
      JOIN MOVIE m ON ss.MovieID = m.MovieID
      WHERE ss.OrderID = ?
    `;
    
    const tickets = await queryAsync(ticketsQuery, [orderId]);
    
    // Get food details
    const foodQuery = `
      SELECT 
        fdo.ItemID,
        fdo.Quantity,
        fd.Name,
        fd.Price
      FROM FOOD_DRINK_ORDER fdo
      JOIN FOOD_AND_DRINK fd ON fdo.ItemID = fd.ItemID
      WHERE fdo.OrderID = ?
    `;
    
    const foodItems = await queryAsync(foodQuery, [orderId]);
    
    res.status(200).json({
      ...order,
      tickets,
      foodItems
    });
  } catch (error) {
    next(error);
  }
};
