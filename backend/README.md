# Cine-Verse Ticket Hub Backend API Documentation

# Dùng database
`
    import db from config/database.js
`

`
db.query(....)
`

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
- **Response Body**: Not implemented
- **Error Codes**: Not implemented
- **Status**: ❌ Not Implemented

### 2. Get Order By ID
- **Endpoint**: `GET /api/orders/:id`
- **Description**: Retrieves details of a specific order
- **Request Parameters**:
  - id: Order ID
- **Response Body**: Not implemented
- **Error Codes**: Not implemented
- **Status**: ❌ Not Implemented

### 3. Create Order
- **Endpoint**: `POST /api/orders`
- **Description**: Creates a new order
- **Request Body**: Not implemented
- **Response Body**: Not implemented
- **Error Codes**: Not implemented
- **Status**: ❌ Not Implemented

### 4. Update Order
- **Endpoint**: `PUT /api/orders/:id`
- **Description**: Updates an existing order
- **Request Parameters**:
  - id: Order ID
- **Request Body**: Not implemented
- **Response Body**: Not implemented
- **Error Codes**: Not implemented
- **Status**: ❌ Not Implemented

### 5. Delete Order
- **Endpoint**: `DELETE /api/orders/:id`
- **Description**: Deletes an order
- **Request Parameters**:
  - id: Order ID
- **Response Body**: Not implemented
- **Error Codes**: Not implemented
- **Status**: ❌ Not Implemented

## Authentication API

### 1. Register
- **Endpoint**: `POST /api/auth/register`
- **Description**: Registers a new user
- **Request Body**: Not implemented
- **Response Body**: Not implemented
- **Error Codes**: Not implemented
- **Status**: ❌ Not Implemented

### 2. Login
- **Endpoint**: `POST /api/auth/login`
- **Description**: Logs in a user
- **Request Body**: Not implemented
- **Response Body**: Not implemented
- **Error Codes**: Not implemented
- **Status**: ❌ Not Implemented

### 3. OTP Request
- **Endpoint**: `POST /api/auth/password/otp`
- **Description**: Requests an OTP for password reset
- **Request Body**: Not implemented
- **Response Body**: Not implemented
- **Error Codes**: Not implemented
- **Status**: ❌ Not Implemented

### 4. Reset Password
- **Endpoint**: `POST /api/auth/password/reset`
- **Description**: Resets the password using OTP
- **Request Body**: Not implemented
- **Response Body**: Not implemented
- **Error Codes**: Not implemented
- **Status**: ❌ Not Implemented

## Voucher API

### 1. Get Voucher List
- **Endpoint**: `GET /api/voucher`
- **Description**: Retrieves a list of all vouchers
- **Request Body**: None
- **Response Body**: Not implemented
- **Error Codes**: Not implemented
- **Status**: ❌ Not Implemented

### 2. Get Voucher By Code
- **Endpoint**: `GET /api/voucher/:code`
- **Description**: Retrieves details of a specific voucher by its code
- **Request Parameters**:
  - code: Voucher Code
- **Response Body**: Not implemented
- **Error Codes**: Not implemented
- **Status**: ❌ Not Implemented

## Food API

### 1. Get Food List
- **Endpoint**: `GET /api/food`
- **Description**: Retrieves a list of all food items
- **Request Body**: None
- **Response Body**: Not implemented
- **Error Codes**: Not implemented
- **Status**: ❌ Not Implemented

### 2. Get Food By ID
- **Endpoint**: `GET /api/food/:foodId`
- **Description**: Retrieves details of a specific food item
- **Request Parameters**:
  - foodId: Food ID
- **Response Body**: Not implemented
- **Error Codes**: Not implemented
- **Status**: ❌ Not Implemented

### 3. Create Food
- **Endpoint**: `POST /api/food`
- **Description**: Creates a new food item
- **Request Body**: Not implemented
- **Response Body**: Not implemented
- **Error Codes**: Not implemented
- **Status**: ❌ Not Implemented

### 4. Update Food
- **Endpoint**: `PUT /api/food/:foodId`
- **Description**: Updates an existing food item
- **Request Parameters**:
  - foodId: Food ID
- **Request Body**: Not implemented
- **Response Body**: Not implemented
- **Error Codes**: Not implemented
- **Status**: ❌ Not Implemented
