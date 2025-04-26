# Cine-Verse Ticket Hub Backend API Documentation

# Dùng database
```js
import db from 'config/database.js';

const result = db.query(....);
```

# API Documentation

## Movies API

### 1. Get All Movies
- **Endpoint**: `GET /api/movies`
- **Description**: Retrieves a list of all movies
- **Request Body**: None
- **Response Body**:
  ```json
  [
    {
      "id": "movie_id",
      "title": "Movie Title",
      "description": "Movie Description",
      "duration": 120,
      "release_date": "2023-01-01",
      "director": "Director Name",
      "cast": "Actor 1, Actor 2",
      "genre": "Action, Adventure",
      "poster_url": "url_to_poster",
      "trailer_url": "url_to_trailer"
    },
    ...
  ]
  ```
- **Error Codes**:
  - 500: Error retrieving movies
- **Status**: ✅ Implemented

### 2. Get Movie By ID
- **Endpoint**: `GET /api/movies/:id`
- **Description**: Retrieves details of a specific movie
- **Request Parameters**: 
  - id: Movie ID
- **Response Body**:
  ```json
  {
    "id": "movie_id",
    "title": "Movie Title",
    "description": "Movie Description",
    "duration": 120,
    "release_date": "2023-01-01",
    "director": "Director Name",
    "cast": "Actor 1, Actor 2",
    "genre": "Action, Adventure",
    "poster_url": "url_to_poster",
    "trailer_url": "url_to_trailer"
  }
  ```
- **Error Codes**:
  - 404: Movie not found
  - 500: Error retrieving movie
- **Status**: ✅ Implemented

### 3. Get Now Showing Movies
- **Endpoint**: `GET /api/movies/now-showing`
- **Description**: Retrieves list of currently showing movies
- **Request Body**: None
- **Response Body**: Same as Get All Movies
- **Error Codes**:
  - 500: Error retrieving movies
- **Status**: ✅ Implemented

### 4. Create Movie
- **Endpoint**: `POST /api/movies/create`
- **Description**: Creates a new movie
- **Request Body**:
  ```json
  {
    "title": "Movie Title",
    "description": "Movie Description",
    "duration": 120,
    "release_date": "2023-01-01",
    "director": "Director Name",
    "cast": "Actor 1, Actor 2",
    "genre": "Action, Adventure",
    "poster_url": "url_to_poster",
    "trailer_url": "url_to_trailer"
  }
  ```
- **Response Body**:
  ```json
  {
    "message": "Movie created successfully"
  }
  ```
- **Error Codes**:
  - 500: Error creating movie
- **Status**: ✅ Implemented

### 5. Update Movie
- **Endpoint**: `PUT /api/movies/update/:id`
- **Description**: Updates an existing movie
- **Request Parameters**:
  - id: Movie ID
- **Request Body**: Same as Create Movie
- **Response Body**:
  ```json
  {
    "message": "Movie updated successfully"
  }
  ```
- **Error Codes**:
  - 500: Error updating movie
- **Status**: ✅ Implemented

### 6. Delete Movie
- **Endpoint**: `DELETE /api/movies/:id`
- **Description**: Deletes a movie
- **Request Parameters**:
  - id: Movie ID
- **Response Body**:
  ```json
  {
    "message": "Movie deleted successfully"
  }
  ```
- **Error Codes**:
  - 500: Error deleting movie
- **Status**: ✅ Implemented

### 7. Get Movie Ratings
- **Endpoint**: `GET /api/movies/:id/ratings`
- **Description**: Gets ratings for a specific movie
- **Request Parameters**:
  - id: Movie ID
- **Response Body**: Not implemented
- **Error Codes**: Not implemented
- **Status**: ❌ Not Implemented

### 8. Post Movie Rating
- **Endpoint**: `POST /api/movies/:id/ratings`
- **Description**: Posts a rating for a specific movie
- **Request Parameters**:
  - id: Movie ID
- **Request Body**: Not implemented
- **Response Body**: Not implemented
- **Error Codes**: Not implemented
- **Status**: ❌ Not Implemented

### 9. Get Movie Showtimes
- **Endpoint**: `GET /api/movies/:id/showtimes`
- **Description**: Gets showtimes for a specific movie
- **Request Parameters**:
  - id: Movie ID
- **Response Body**: Not implemented
- **Error Codes**: Not implemented
- **Status**: ❌ Not Implemented

## Cinema API

### 1. Get All Cinemas
- **Endpoint**: `GET /api/cinemas`
- **Description**: Retrieves a list of all cinemas
- **Request Body**: None
- **Response Body**:
  ```json
  [
    {
      "id": "cinema_id",
      "name": "Cinema Name",
      "location": "Cinema Location",
      "address": "Cinema Address",
      "contact_info": "Contact Information"
    },
    ...
  ]
  ```
- **Error Codes**:
  - 500: Error retrieving cinemas
- **Status**: ✅ Implemented

### 2. Get Cinema By ID
- **Endpoint**: `GET /api/cinemas/:id`
- **Description**: Retrieves details of a specific cinema
- **Request Parameters**:
  - id: Cinema ID
- **Response Body**:
  ```json
  {
    "id": "cinema_id",
    "name": "Cinema Name",
    "location": "Cinema Location",
    "address": "Cinema Address",
    "contact_info": "Contact Information"
  }
  ```
- **Error Codes**:
  - 404: Cinema not found
  - 500: Error retrieving cinema
- **Status**: ✅ Implemented

### 3. Create Cinema
- **Endpoint**: `POST /api/cinemas`
- **Description**: Creates a new cinema
- **Request Body**:
  ```json
  {
    "name": "Cinema Name",
    "location": "Cinema Location",
    "address": "Cinema Address",
    "contact_info": "Contact Information"
  }
  ```
- **Response Body**:
  ```json
  {
    "message": "Cinema created successfully"
  }
  ```
- **Error Codes**:
  - 500: Error creating cinema
- **Status**: ✅ Implemented

### 4. Update Cinema
- **Endpoint**: `PUT /api/cinemas/:id`
- **Description**: Updates an existing cinema
- **Request Parameters**:
  - id: Cinema ID
- **Request Body**: Same as Create Cinema
- **Response Body**:
  ```json
  {
    "message": "Cinema updated successfully"
  }
  ```
- **Error Codes**:
  - 500: Error updating cinema
- **Status**: ✅ Implemented

### 5. Delete Cinema
- **Endpoint**: `DELETE /api/cinemas/:id`
- **Description**: Deletes a cinema
- **Request Parameters**:
  - id: Cinema ID
- **Response Body**:
  ```json
  {
    "message": "Cinema deleted successfully"
  }
  ```
- **Error Codes**:
  - 500: Error deleting cinema
- **Status**: ✅ Implemented

## User/Customer API

### 1. Get All Users
- **Endpoint**: `GET /api/customers`
- **Description**: Retrieves a list of all users/customers
- **Request Body**: None
- **Response Body**:
  ```json
  [
    {
      "id": "user_id",
      "name": "User Name",
      "email": "user@example.com",
      "phone_number": "1234567890",
      "dob": "1990-01-01"
    },
    ...
  ]
  ```
- **Error Codes**:
  - 500: Error retrieving users
- **Status**: ✅ Implemented

### 2. Get User By ID
- **Endpoint**: `GET /api/customers/:id`
- **Description**: Retrieves details of a specific user
- **Request Parameters**:
  - id: User ID
- **Response Body**:
  ```json
  {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "phone_number": "1234567890",
    "dob": "1990-01-01"
  }
  ```
- **Error Codes**:
  - 404: User not found
  - 500: Error retrieving user
- **Status**: ✅ Implemented

### 3. Get User Orders
- **Endpoint**: `GET /api/customers/:id/orders`
- **Description**: Retrieves orders of a specific user
- **Request Parameters**:
  - id: User ID
- **Response Body**:
  ```json
  [
    {
      "id": "order_id",
      "customer_id": "user_id",
      "order_date": "2023-01-01",
      "total_price": 100.00,
      "status": "Completed"
    },
    ...
  ]
  ```
- **Error Codes**:
  - 404: Orders not found
  - 500: Error retrieving orders
- **Status**: ✅ Implemented

### 4. Create User
- **Endpoint**: `POST /api/customers`
- **Description**: Creates a new user
- **Request Body**:
  ```json
  {
    "name": "User Name",
    "email": "user@example.com",
    "password": "password",
    "phone_number": "1234567890",
    "dob": "1990-01-01"
  }
  ```
- **Response Body**:
  ```json
  {
    "id": "new_user_id",
    "name": "User Name",
    "email": "user@example.com",
    "phone_number": "1234567890",
    "dob": "1990-01-01"
  }
  ```
- **Error Codes**:
  - 500: Error creating user
- **Status**: ✅ Implemented

### 5. Update User
- **Endpoint**: `PUT /api/customers/:id`
- **Description**: Updates an existing user
- **Request Parameters**:
  - id: User ID
- **Request Body**: Same as Create User (without password)
- **Response Body**:
  ```json
  {
    "id": "user_id",
    "name": "Updated User Name",
    "email": "updated@example.com",
    "phone_number": "0987654321",
    "dob": "1990-01-01"
  }
  ```
- **Error Codes**:
  - 500: Error updating user
- **Status**: ✅ Implemented

### 6. Delete User
- **Endpoint**: `DELETE /api/customers/:id`
- **Description**: Deletes a user
- **Request Parameters**:
  - id: User ID
- **Response Body**:
  ```json
  {
    "message": "User deleted successfully"
  }
  ```
- **Error Codes**:
  - 500: Error deleting user
- **Status**: ✅ Implemented

## Showtime API

### 1. Get All Showtimes
- **Endpoint**: `GET /api/showtimes`
- **Description**: Retrieves a list of all showtimes
- **Request Body**: None
- **Response Body**:
  ```json
  [
    {
      "id": "showtime_id",
      "movie_id": "movie_id",
      "cinema_id": "cinema_id",
      "start_time": "2023-01-01 12:00:00",
      "end_time": "2023-01-01 14:00:00",
      "price": 50.00
    },
    ...
  ]
  ```
- **Error Codes**:
  - 500: Error retrieving showtimes
- **Status**: ✅ Implemented

### 2. Get Showtime By ID
- **Endpoint**: `GET /api/showtimes/:id`
- **Description**: Retrieves details of a specific showtime
- **Request Parameters**:
  - id: Showtime ID
- **Response Body**:
  ```json
  {
    "id": "showtime_id",
    "movie_id": "movie_id",
    "cinema_id": "cinema_id",
    "start_time": "2023-01-01 12:00:00",
    "end_time": "2023-01-01 14:00:00",
    "price": 50.00
  }
  ```
- **Error Codes**:
  - 404: Showtime not found
  - 500: Error retrieving showtime
- **Status**: ✅ Implemented

### 3. Create Showtime
- **Endpoint**: `POST /api/showtimes`
- **Description**: Creates a new showtime
- **Request Body**:
  ```json
  {
    "movie_id": "movie_id",
    "cinema_id": "cinema_id",
    "start_time": "2023-01-01 12:00:00",
    "end_time": "2023-01-01 14:00:00",
    "price": 50.00
  }
  ```
- **Response Body**:
  ```json
  {
    "message": "Showtime created successfully"
  }
  ```
- **Error Codes**:
  - 500: Error creating showtime
- **Status**: ✅ Implemented

### 4. Update Showtime
- **Endpoint**: `PUT /api/showtimes/:id`
- **Description**: Updates an existing showtime
- **Request Parameters**:
  - id: Showtime ID
- **Request Body**: Same as Create Showtime
- **Response Body**:
  ```json
  {
    "message": "Showtime updated successfully"
  }
  ```
- **Error Codes**:
  - 500: Error updating showtime
- **Status**: ✅ Implemented

### 5. Delete Showtime
- **Endpoint**: `DELETE /api/showtimes/:id`
- **Description**: Deletes a showtime
- **Request Parameters**:
  - id: Showtime ID
- **Response Body**:
  ```json
  {
    "message": "Showtime deleted successfully"
  }
  ```
- **Error Codes**:
  - 500: Error deleting showtime
- **Status**: ✅ Implemented

## Orders API

### 1. Get All Orders
- **Endpoint**: `GET /api/orders`
- **Description**: Retrieves a list of all orders
- **Request Body**: None
- **Response Body**:
  ```json
  [
    {
      "OrderID": "order_id",
      "CustomerID": "customer_id",
      "OrderDate": "2023-01-01T12:00:00",
      "TotalAmount": 100.00,
      "Status": "Booked",
      "PaymentMethod": "Credit Card",
      "VoucherID": "voucher_id"
    },
    ...
  ]
  ```
- **Error Codes**:
  - 500: Error retrieving orders
- **Status**: ✅ Implemented

### 2. Get Order By ID
- **Endpoint**: `GET /api/orders/:id`
- **Description**: Retrieves details of a specific order
- **Request Parameters**:
  - id: Order ID
- **Response Body**:
  ```json
  {
    "OrderID": "order_id",
    "CustomerID": "customer_id",
    "OrderDate": "2023-01-01T12:00:00",
    "TotalAmount": 100.00,
    "Status": "Booked",
    "PaymentMethod": "Credit Card",
    "VoucherID": "voucher_id"
  }
  ```
- **Error Codes**:
  - 404: Order not found
  - 500: Error retrieving order
- **Status**: ✅ Implemented

### 3. Create Order
- **Endpoint**: `POST /api/orders`
- **Description**: Creates a new order
- **Request Body**:
  ```json
  {
    "showtimeId": "showtime_id",
    "movieId": "movie_id",
    "seatNumbers": ["A1", "A2"],
    "foodItems": [
      {
        "itemId": "food_id",
        "quantity": 2
      }
    ],
    "voucherId": "voucher_id",
    "paymentMethod": "Credit Card"
  }
  ```
- **Response Body**:
  ```json
  {
    "orderId": "order_id"
  }
  ```
- **Error Codes**:
  - 500: Failed to create full order
- **Status**: ✅ Implemented

### 4. Update Order
- **Endpoint**: `PUT /api/orders/:id`
- **Description**: Updates an existing order
- **Request Parameters**:
  - id: Order ID
- **Request Body**: 
  ```json
  {
    "status": "Completed",
    "paymentMethod": "Credit Card"
  }
  ```
- **Response Body**:
  ```json
  {
    "message": "Order updated successfully"
  }
  ```
- **Error Codes**:
  - 500: Error updating order
- **Status**: ✅ Implemented

### 5. Delete Order
- **Endpoint**: `DELETE /api/orders/:id`
- **Description**: Deletes an order
- **Request Parameters**:
  - id: Order ID
- **Response Body**:
  ```json
  {
    "message": "Order deleted successfully"
  }
  ```
- **Error Codes**:
  - 500: Error deleting order
- **Status**: ✅ Implemented

## Food API

### 1. Get Food List
- **Endpoint**: `GET /api/food`
- **Description**: Retrieves a list of all food items
- **Request Body**: None
- **Response Body**:
  ```json
  [
    {
      "FoodID": "food_id",
      "Name": "Food Name",
      "Description": "Food Description",
      "Price": 50.00,
      "Category": "Popcorn",
      "ImageURL": "url_to_image"
    },
    ...
  ]
  ```
- **Error Codes**:
  - 500: Error retrieving food
- **Status**: ✅ Implemented

### 2. Get Popcorn Items
- **Endpoint**: `GET /api/food/popcorn`
- **Description**: Retrieves a list of all popcorn items
- **Request Body**: None
- **Response Body**: Same format as Get Food List, filtered by Category="Popcorn"
- **Error Codes**:
  - 500: Error retrieving popcorn items
- **Status**: ✅ Implemented

### 3. Get Drink Items
- **Endpoint**: `GET /api/food/drinks`
- **Description**: Retrieves a list of all drink items
- **Request Body**: None
- **Response Body**: Same format as Get Food List, filtered by Category="Drinks"
- **Error Codes**:
  - 500: Error retrieving drink items
- **Status**: ✅ Implemented

### 4. Get Other Food Items
- **Endpoint**: `GET /api/food/others`
- **Description**: Retrieves a list of all other food items
- **Request Body**: None
- **Response Body**: Same format as Get Food List, filtered by Category="Others"
- **Error Codes**:
  - 500: Error retrieving other items
- **Status**: ✅ Implemented

### 5. Get Food By ID
- **Endpoint**: `GET /api/food/:id`
- **Description**: Retrieves details of a specific food item
- **Request Parameters**:
  - id: Food ID
- **Response Body**:
  ```json
  {
    "FoodID": "food_id",
    "Name": "Food Name",
    "Description": "Food Description",
    "Price": 50.00,
    "Category": "Popcorn",
    "ImageURL": "url_to_image"
  }
  ```
- **Error Codes**:
  - 404: Food not found
  - 500: Error retrieving food
- **Status**: ✅ Implemented

## Authentication API

### 1. Register
- **Endpoint**: `POST /api/auth/register`
- **Description**: Registers a new user
- **Request Body**:
  ```json
  {
    "FullName": "User Name",
    "DateOfBirth": "1990-01-01",
    "Email": "user@example.com",
    "PhoneNumber": "1234567890",
    "MembershipLevel": "Standard",
    "Password": "password123"
  }
  ```
- **Response Body**:
  ```json
  {
    "message": "User registered successfully",
    "token": "jwt_token",
    "user": {
      "id": "user_id",
      "FullName": "User Name",
      "Email": "user@example.com",
      "MembershipLevel": "Standard"
    }
  }
  ```
- **Error Codes**:
  - 400: Required fields missing
  - 409: Email already in use
  - 500: Internal server error
- **Status**: ✅ Implemented

### 2. Login
- **Endpoint**: `POST /api/auth/login`
- **Description**: Logs in a user
- **Request Body**:
  ```json
  {
    "Email": "user@example.com",
    "Password": "password123"
  }
  ```
- **Response Body**:
  ```json
  {
    "message": "Login successful",
    "token": "jwt_token",
    "user": {
      "id": "user_id",
      "FullName": "User Name",
      "Email": "user@example.com",
      "MembershipLevel": "Standard"
    }
  }
  ```
- **Error Codes**:
  - 400: Email and password are required
  - 401: Invalid email or password
  - 500: Internal server error
- **Status**: ✅ Implemented

### 3. Admin Login
- **Endpoint**: `POST /api/auth/admin/login`
- **Description**: Logs in an admin user
- **Request Body**:
  ```json
  {
    "Username": "admin",
    "Password": "admin_password"
  }
  ```
- **Response Body**:
  ```json
  {
    "message": "Admin login successful",
    "token": "jwt_token"
  }
  ```
- **Error Codes**:
  - 401: Invalid username or password
  - 500: Internal server error
- **Status**: ✅ Implemented

### 4. Reset Password
- **Endpoint**: `POST /api/auth/password/reset`
- **Description**: Resets the password
- **Request Body**:
  ```json
  {
    "Email": "user@example.com",
    "newPassword": "new_password"
  }
  ```
- **Response Body**:
  ```json
  {
    "message": "Password reset successfully"
  }
  ```
- **Error Codes**:
  - 400: Email and new password are required
  - 404: User not found
  - 500: Internal server error
- **Status**: ✅ Implemented

### 5. Verify Token
- **Endpoint**: `GET /api/auth/verify`
- **Description**: Verifies a JWT token and returns user info
- **Request Headers**:
  - Authorization: Bearer [jwt_token]
- **Response Body**:
  ```json
  {
    "message": "User verified",
    "user": {
      "id": "user_id",
      "FullName": "User Name",
      "Email": "user@example.com",
      "MembershipLevel": "Standard"
    }
  }
  ```
- **Error Codes**:
  - 401: No token provided or Unauthorized
  - 500: Internal server error
- **Status**: ✅ Implemented

## Voucher API

### 1. Get All Vouchers
- **Endpoint**: `GET /api/vouchers`
- **Description**: Retrieves a list of all vouchers
- **Request Body**: None
- **Response Body**:
  ```json
  [
    {
      "VoucherID": "voucher_id",
      "Code": "SAVE10",
      "Description": "10% off your order",
      "DiscountValue": 10.00,
      "MinPurchaseAmount": 50.00,
      "ExpiryDate": "2023-12-31",
      "IsActive": true
    },
    ...
  ]
  ```
- **Error Codes**:
  - 500: Error retrieving vouchers
- **Status**: ✅ Implemented

### 2. Get Voucher By Code
- **Endpoint**: `GET /api/vouchers/:code`
- **Description**: Retrieves details of a specific voucher by its code
- **Request Parameters**:
  - code: Voucher Code
- **Response Body**:
  ```json
  {
    "VoucherID": "voucher_id",
    "Code": "SAVE10",
    "Description": "10% off your order",
    "DiscountValue": 10.00,
    "MinPurchaseAmount": 50.00,
    "ExpiryDate": "2023-12-31",
    "IsActive": true
  }
  ```
- **Error Codes**:
  - 500: Error retrieving voucher
- **Status**: ✅ Implemented

## Seat API

### 1. Get All Seats
- **Endpoint**: `GET /api/seats`
- **Description**: Retrieves a list of all seats
- **Request Body**: None
- **Response Body**:
  ```json
  [
    {
      "SeatID": "seat_id",
      "SeatNumber": "A1",
      "SeatType": "Standard",
      "Price": 50.00
    },
    ...
  ]
  ```
- **Error Codes**:
  - 500: Internal server error
- **Status**: ✅ Implemented

### 2. Get Seat By ID
- **Endpoint**: `GET /api/seats/:id`
- **Description**: Retrieves details of a specific seat
- **Request Parameters**:
  - id: Seat ID
- **Response Body**:
  ```json
  {
    "SeatID": "seat_id",
    "SeatNumber": "A1",
    "SeatType": "Standard",
    "Price": 50.00
  }
  ```
- **Error Codes**:
  - 404: Seat not found
  - 500: Internal server error
- **Status**: ✅ Implemented

### 3. Get Seats By Showtime ID
- **Endpoint**: `GET /api/seats/showtime/:id`
- **Description**: Retrieves all seats for a specific showtime
- **Request Parameters**:
  - id: Showtime ID
- **Response Body**:
  ```json
  [
    {
      "SeatID": "seat_id",
      "SeatNumber": "A1",
      "SeatType": "Standard",
      "Status": "Available",
      "Price": 50.00
    },
    ...
  ]
  ```
- **Error Codes**:
  - 500: Internal server error
- **Status**: ✅ Implemented

### 4. Create Seat
- **Endpoint**: `POST /api/seats`
- **Description**: Creates a new seat
- **Request Body**:
  ```json
  {
    "SeatNumber": "A1",
    "SeatType": "Standard",
    "Price": 50.00
  }
  ```
- **Response Body**:
  ```json
  {
    "message": "Seat created successfully"
  }
  ```
- **Error Codes**:
  - 500: Internal server error
- **Status**: ✅ Implemented

## Report API

### 1. Get Statistics Report
- **Endpoint**: `GET /api/reports/statistics`
- **Description**: Retrieves general statistics about the system
- **Request Body**: None
- **Response Body**:
  ```json
  {
    "totalCustomers": 100,
    "totalMovies": 50,
    "totalOrders": 200,
    "totalRevenue": 10000.00
  }
  ```
- **Error Codes**:
  - 500: Error fetching statistic report
- **Status**: ✅ Implemented

### 2. Get Monthly Revenue Report
- **Endpoint**: `GET /api/reports/revenue/monthly`
- **Description**: Retrieves monthly revenue data
- **Request Body**: None
- **Response Body**:
  ```json
  [
    {
      "month": "January",
      "year": 2025,
      "revenue": 1500.00
    },
    ...
  ]
  ```
- **Error Codes**:
  - 500: Error fetching monthly revenue report
- **Status**: ✅ Implemented

### 3. Get Daily Revenue Report
- **Endpoint**: `GET /api/reports/revenue/daily`
- **Description**: Retrieves daily revenue data
- **Request Body**: None
- **Response Body**:
  ```json
  [
    {
      "date": "2025-04-25",
      "revenue": 500.00
    },
    ...
  ]
  ```
- **Error Codes**:
  - 500: Error fetching daily revenue report
- **Status**: ✅ Implemented

### 4. Get Movie Revenue Report
- **Endpoint**: `GET /api/reports/revenue/movies`
- **Description**: Retrieves revenue data by movie
- **Request Body**: None
- **Response Body**:
  ```json
  [
    {
      "MovieID": "movie_id",
      "Title": "Movie Title",
      "Revenue": 2000.00,
      "TicketsSold": 150
    },
    ...
  ]
  ```
- **Error Codes**:
  - 500: Error fetching movie revenue report
- **Status**: ✅ Implemented

### 5. Get Top Customers Report
- **Endpoint**: `GET /api/reports/customers/top`
- **Description**: Retrieves data on top customers by spending
- **Request Headers**:
  - customerlimit: Number of customers to return (default: 10)
- **Request Body**: None
- **Response Body**:
  ```json
  [
    {
      "CustomerID": "customer_id",
      "FullName": "Customer Name",
      "TotalSpent": 1500.00,
      "OrderCount": 15
    },
    ...
  ]
  ```
- **Error Codes**:
  - 500: Error fetching top customer report
- **Status**: ✅ Implemented
