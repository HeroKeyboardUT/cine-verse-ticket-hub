-- Tạo database
CREATE DATABASE IF NOT EXISTS CinemaSystem;
USE CinemaSystem;
CREATE TABLE CINEMA (
    CinemaID CHAR(6) PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    OpeningHours TIME NOT NULL,
    ClosingHours TIME NOT NULL,
    Location VARCHAR(200) NOT NULL
);


CREATE TABLE CINEMA_PHONE (
    PhoneNumber VARCHAR(15) NOT NULL UNIQUE,
    CinemaID CHAR(6) NOT NULL,
    PRIMARY KEY (PhoneNumber, CinemaID),
    FOREIGN KEY (CinemaID) REFERENCES CINEMA(CinemaID)
);

CREATE TABLE CUSTOMER (
    CustomerID CHAR(6) PRIMARY KEY,
    FullName VARCHAR(100) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    PhoneNumber VARCHAR(15) NOT NULL UNIQUE,
    DateOfBirth DATE NOT NULL,
    MembershipLevel VARCHAR(50) NOT NULL DEFAULT 'Standard',
    RegistrationDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    TotalSpent DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (TotalSpent >= 0),
    TotalOrders INT NOT NULL DEFAULT 0 CHECK (TotalOrders >= 0)
);

CREATE TABLE SCREEN (
    ScreenID CHAR(6) PRIMARY KEY,
    Size VARCHAR(50) NOT NULL,
    Type VARCHAR(50) NOT NULL,
    SupportedFormat VARCHAR(100) NOT NULL
);

CREATE TABLE ROOM (
    CinemaID CHAR(6) NOT NULL,
    RoomNumber INT NOT NULL,
    Capacity INT NOT NULL CHECK (Capacity BETWEEN 10 AND 500),
    Type VARCHAR(50) NOT NULL,
    ScreenID CHAR(6) NOT NULL,
    PRIMARY KEY (CinemaID, RoomNumber),
    FOREIGN KEY (CinemaID) REFERENCES CINEMA(CinemaID),
    FOREIGN KEY (ScreenID) REFERENCES SCREEN(ScreenID)
);


CREATE TABLE SEAT (
    CinemaID CHAR(6) NOT NULL,
    RoomNumber INT NOT NULL,
    SeatNumber CHAR(2) NOT NULL,
    SeatType VARCHAR(50) NOT NULL,
    PRIMARY KEY (CinemaID, RoomNumber, SeatNumber),
    FOREIGN KEY (CinemaID, RoomNumber) REFERENCES ROOM(CinemaID, RoomNumber)
);

CREATE TABLE MOVIE (
    MovieID CHAR(6) PRIMARY KEY,
    Title VARCHAR(100) NOT NULL,
    ReleaseDate DATE NOT NULL,
    Duration INT CHECK (Duration > 0) NOT NULL,
    Language VARCHAR(50) NOT NULL,
    Description TEXT,
    PosterURL TEXT,
    AgeRating VARCHAR(10) NOT NULL,
    Studio VARCHAR(100) NOT NULL,
    Country VARCHAR(50) NOT NULL,
    Director VARCHAR(100) NOT NULL,
    CustomerRating DECIMAL(4,2),
    isShow BOOLEAN NOT NULL
);


CREATE TABLE SHOWTIME (
	ShowTimeID CHAR(6) PRIMARY KEY,
    CinemaID CHAR(6) NOT NULL,
    RoomNumber INT NOT NULL,
    MovieID CHAR(6) NOT NULL,
    StartTime DATETIME NOT NULL,
    EndTime DATETIME NOT NULL,
    Duration INT NOT NULL,
    Format VARCHAR(50) NOT NULL,
    Subtitle BOOLEAN DEFAULT TRUE,
    Dub BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (CinemaID, RoomNumber) REFERENCES ROOM(CinemaID, RoomNumber),
    FOREIGN KEY (MovieID) REFERENCES MOVIE(MovieID),
    CHECK (EndTime > StartTime)
);

CREATE TABLE VOUCHER (
    VoucherID CHAR(6) PRIMARY KEY,
    Code VARCHAR(50) NOT NULL UNIQUE,
    Description TEXT,
    DiscountAmount DECIMAL(10,2),
    DiscountType ENUM('Percentage', 'Fixed'),
    IssueDate DATE NOT NULL,
    ExpirationDate DATE NOT NULL,
    MaxUsage INT DEFAULT 1 CHECK (MaxUsage > 0),
    UsedCount INT DEFAULT 0,
    IsActive BOOLEAN DEFAULT TRUE,
    CHECK (IssueDate < ExpirationDate),
    CHECK (DiscountType = 'Percentage' AND DiscountAmount BETWEEN 0 AND 100 OR DiscountType = 'Fixed' AND DiscountAmount >= 0)
);

CREATE TABLE ORDERS (
    OrderID CHAR(6) PRIMARY KEY,
    OrderDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Status VARCHAR(20) DEFAULT 'Processing',
    PaymentMethod VARCHAR(20) NOT NULL,
    TotalPrice DECIMAL(10,2) CHECK (TotalPrice >= 0),
    VoucherID CHAR(6),
    CustomerID CHAR(6) NOT NULL,
    isTicket BOOLEAN DEFAULT FALSE,
    isFood BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (CustomerID) REFERENCES CUSTOMER(CustomerID),
    FOREIGN KEY (VoucherID) REFERENCES VOUCHER(VoucherID)
);

CREATE TABLE SHOWTIME_SEAT (
	ShowTimeID CHAR(6) NOT NULL,
    SeatNumber CHAR(2) NOT NULL,
    OrderID CHAR(6) NOT NULL,
    Price DECIMAL(10,2) NOT NULL CHECK (Price >= 0),
    PRIMARY KEY (ShowTimeID, SeatNumber),
    FOREIGN KEY (ShowTimeID) REFERENCES SHOWTIME(ShowTimeID),
    FOREIGN KEY (OrderID) REFERENCES ORDERS(OrderID)
);

CREATE TABLE RATING (
    CustomerID CHAR(6) NOT NULL,
    MovieID CHAR(6) NOT NULL,
    Score INT NOT NULL CHECK (Score BETWEEN 1 AND 10),
    Comment TEXT,
	RatingDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (CustomerID, MovieID),
    FOREIGN KEY (CustomerID) REFERENCES CUSTOMER(CustomerID),
    FOREIGN KEY (MovieID) REFERENCES MOVIE(MovieID)
);

CREATE TABLE MOVIE_GENRE (
    MovieID CHAR(6) NOT NULL,
    Genre VARCHAR(50),
    PRIMARY KEY (MovieID, Genre),
    FOREIGN KEY (MovieID) REFERENCES MOVIE(MovieID)
);

CREATE TABLE VOUCHER_CONSTRAINT (
    VoucherID CHAR(6) NOT NULL,
    Type VARCHAR(10) NOT NULL,
    Above FLOAT NOT NULL,
    Below FLOAT NOT NULL,
    PRIMARY KEY (VoucherID, Type),
    FOREIGN KEY (VoucherID) REFERENCES VOUCHER(VoucherID)
);


CREATE TABLE FOOD_AND_DRINK (
    ItemID CHAR(6) PRIMARY KEY,
    Type ENUM('POPCORN', 'DRINK', 'OTHERS'),
    Name VARCHAR(50) NOT NULL,
    StockQuantity INT NOT NULL,
    IsAvailable BOOLEAN ,
    Price DECIMAL(10,2) NOT NULL CHECK (Price >= 0)
);

CREATE TABLE FOOD_DRINK_ORDER (
    OrderID CHAR(6),
    ItemID CHAR(6),
    Quantity INT NOT NULL CHECK (Quantity > 0),
    PRIMARY KEY (OrderID, ItemID),
    FOREIGN KEY (OrderID) REFERENCES ORDERS(OrderID),
    FOREIGN KEY (ItemID) REFERENCES FOOD_AND_DRINK(ItemID)
);


CREATE TABLE POPCORN (
    ItemID CHAR(6) PRIMARY KEY,
    Flavor VARCHAR(100),
    Size ENUM('Small', 'Medium', 'Large'),
    FOREIGN KEY (ItemID) REFERENCES FOOD_AND_DRINK(ItemID)
);

CREATE TABLE DRINK (
    ItemID CHAR(6) PRIMARY KEY,
    Size ENUM('Small', 'Medium', 'Large'),
    FOREIGN KEY (ItemID) REFERENCES FOOD_AND_DRINK(ItemID)
);
-- INSERT --
SET SQL_SAFE_UPDATES = 0;

-- Chèn dữ liệu mẫu cho bảng CINEMA (4 dòng)
INSERT INTO CINEMA (CinemaID, Name, OpeningHours, ClosingHours, Location) VALUES
('CIN001', 'Galaxy Cinema', '09:00:00', '23:00:00', '123 Nguyen Hue, District 1, HCMC'),
('CIN002', 'CGV Vincom', '08:30:00', '22:30:00', '456 Le Loi, District 3, HCMC'),
('CIN003', 'Lotte Cinema', '10:00:00', '23:30:00', '789 Tran Hung Dao, District 5, HCMC'),
('CIN004', 'BHD Star', '09:30:00', '22:00:00', '101 Vo Van Tan, District 7, HCMC');

-- Chèn dữ liệu mẫu cho bảng CINEMA_PHONE (4 dòng)
INSERT INTO CINEMA_PHONE (PhoneNumber, CinemaID) VALUES
('0901234567', 'CIN001'),
('0902345678', 'CIN002'),
('0903456789', 'CIN003'),
('0904567890', 'CIN004');

-- Chèn dữ liệu mẫu cho bảng CUSTOMER (4 dòng)
INSERT INTO CUSTOMER (CustomerID, FullName, Email, PhoneNumber, DateOfBirth, MembershipLevel, RegistrationDate, TotalSpent, TotalOrders) VALUES
('CUS001', 'Nguyen Van A', 'vana@gmail.com', '0912345678', '1995-05-15', 'Standard', '2025-01-01 10:00:00', 500000.00, 5),
('CUS002', 'Tran Thi B', 'thib@gmail.com', '0913456789', '1998-03-22', 'Premium', '2025-02-01 12:00:00', 1200000.00, 10),
('CUS003', 'Le Van C', 'vanc@gmail.com', '0914567890', '2000-07-10', 'Standard', '2025-03-01 14:00:00', 300000.00, 3),
('CUS004', 'Pham Thi D', 'thid@gmail.com', '0915678901', '1992-11-30', 'VIP', '2025-04-01 16:00:00', 2000000.00, 15);

-- Chèn dữ liệu mẫu cho bảng SCREEN (4 dòng)
INSERT INTO SCREEN (ScreenID, Size, Type, SupportedFormat) VALUES
('SCR001', 'Large', 'IMAX', '2D, 3D, IMAX'),
('SCR002', 'Medium', 'Standard', '2D, 3D'),
('SCR003', 'Small', 'Standard', '2D'),
('SCR004', 'Large', '4DX', '2D, 3D, 4DX');

-- Chèn dữ liệu mẫu cho bảng ROOM (4 dòng)
INSERT INTO ROOM (CinemaID, RoomNumber, Capacity, Type, ScreenID) VALUES
('CIN001', 1, 100, 'Standard', 'SCR002'),
('CIN001', 2, 150, 'VIP', 'SCR001'),
('CIN002', 1, 80, 'Standard', 'SCR003'),
('CIN002', 2, 200, 'IMAX', 'SCR004');

-- Chèn dữ liệu mẫu cho bảng SEAT (8 dòng, đảm bảo ≥ 4)
INSERT INTO SEAT (CinemaID, RoomNumber, SeatNumber, SeatType) VALUES
('CIN001', 1, 'A1', 'Standard'),
('CIN001', 1, 'A2', 'Standard'),
('CIN001', 1, 'B1', 'VIP'),
('CIN001', 1, 'B2', 'VIP'),
('CIN002', 1, 'C1', 'Standard'),
('CIN002', 1, 'C2', 'Standard'),
('CIN002', 1, 'D1', 'Standard'),
('CIN002', 1, 'D2', 'Standard');

-- Chèn dữ liệu mẫu cho bảng MOVIE (4 dòng)
INSERT INTO MOVIE (MovieID, Title, ReleaseDate, Duration, Language, Description, PosterURL, AgeRating, Studio, Country, Director, CustomerRating, isShow) VALUES
('MOV001', 'Avengers: Endgame', '2019-04-26', 181, 'English', 'The epic conclusion to the Infinity Saga.', 'http://poster1.com', 'PG-13', 'Marvel Studios', 'USA', 'Russo Brothers', 8.5, TRUE),
('MOV002', 'Parasite', '2019-05-30', 132, 'Korean', 'A dark comedy about class disparity.', 'http://poster2.com', 'R', 'CJ Entertainment', 'South Korea', 'Bong Joon-ho', 8.6, TRUE),
('MOV003', 'Dune: Part Two', '2024-03-01', 166, 'English', 'The continuation of Paul Atreides journey.', 'http://poster3.com', 'PG-13', 'Warner Bros', 'USA', 'Denis Villeneuve', 8.8, TRUE),
('MOV004', 'Oppenheimer', '2023-07-21', 180, 'English', 'The story of the atomic bomb.', 'http://poster4.com', 'R', 'Universal Pictures', 'USA', 'Christopher Nolan', 8.7, FALSE);

-- Chèn dữ liệu mẫu cho bảng SHOWTIME (4 dòng)
INSERT INTO SHOWTIME (ShowTimeID, CinemaID, RoomNumber, MovieID, StartTime, EndTime, Duration, Format, Subtitle, Dub) VALUES
('SHT001', 'CIN001', 1, 'MOV001', '2025-04-21 14:00:00', '2025-04-21 17:01:00', 181, '3D', TRUE, FALSE),
('SHT002', 'CIN001', 2, 'MOV002', '2025-04-21 15:00:00', '2025-04-21 17:12:00', 132, '2D', TRUE, FALSE),
('SHT003', 'CIN002', 1, 'MOV003', '2025-04-21 18:00:00', '2025-04-21 20:46:00', 166, 'IMAX', TRUE, FALSE),
('SHT004', 'CIN002', 2, 'MOV004', '2025-04-21 19:00:00', '2025-04-21 22:00:00', 180, '4DX', TRUE, FALSE);

-- Chèn dữ liệu mẫu cho bảng VOUCHER (4 dòng)
INSERT INTO VOUCHER (VoucherID, Code, Description, DiscountAmount, DiscountType, IssueDate, ExpirationDate, MaxUsage, UsedCount, IsActive) VALUES
('VCH001', 'DISCOUNT10', '10% off for first order', 10.00, 'Percentage', '2025-01-01', '2025-12-31', 100, 50, TRUE),
('VCH002', 'FIXED500', '50000 VND off', 50000.00, 'Fixed', '2025-02-01', '2025-11-30', 50, 20, TRUE),
('VCH003', 'SUMMER20', '20% off for summer', 20.00, 'Percentage', '2025-06-01', '2025-08-31', 200, 100, TRUE),
('VCH004', 'VIP100', '100000 VND off for VIP', 100000.00, 'Fixed', '2025-03-01', '2025-09-30', 30, 10, TRUE);

-- Chèn dữ liệu mẫu cho bảng ORDERS (4 dòng)
INSERT INTO ORDERS (OrderID, OrderDate, Status, PaymentMethod, TotalPrice, VoucherID, CustomerID, isTicket, isFood) VALUES
('ORD001', '2025-04-20 10:00:00', 'Completed', 'Credit Card', 150000.00, 'VCH001', 'CUS001', TRUE, FALSE),
('ORD002', '2025-04-20 11:00:00', 'Processing', 'Cash', 200000.00, NULL, 'CUS002', TRUE, TRUE),
('ORD003', '2025-04-20 12:00:00', 'Completed', 'Mobile App', 80000.00, 'VCH002', 'CUS003', FALSE, TRUE),
('ORD004', '2025-04-20 13:00:00', 'Completed', 'Credit Card', 300000.00, 'VCH003', 'CUS004', TRUE, FALSE);

-- Chèn dữ liệu mẫu cho bảng SHOWTIME_SEAT (4 dòng)
INSERT INTO SHOWTIME_SEAT (ShowTimeID, SeatNumber, OrderID, Price) VALUES
('SHT001', 'A1', 'ORD001', 75000.00),
('SHT001', 'A2', 'ORD001', 75000.00),
('SHT002', 'B1', 'ORD002', 100000.00),
('SHT003', 'C1', 'ORD004', 150000.00);

-- Chèn dữ liệu mẫu cho bảng RATING (4 dòng)
INSERT INTO RATING (CustomerID, MovieID, Score, Comment, RatingDate) VALUES
('CUS001', 'MOV001', 8, 'Great action movie!', '2025-04-20 15:00:00'),
('CUS002', 'MOV002', 9, 'Brilliant storytelling.', '2025-04-20 16:00:00'),
('CUS003', 'MOV003', 7, 'Visually stunning.', '2025-04-20 17:00:00'),
('CUS004', 'MOV004', 8, 'Very intense.', '2025-04-20 18:00:00');

-- Chèn dữ liệu mẫu cho bảng MOVIE_GENRE (6 dòng, đảm bảo ≥ 4)
INSERT INTO MOVIE_GENRE (MovieID, Genre) VALUES
('MOV001', 'Action'),
('MOV001', 'Adventure'),
('MOV002', 'Drama'),
('MOV002', 'Comedy'),
('MOV003', 'Sci-Fi'),
('MOV004', 'Biography');

-- Chèn dữ liệu mẫu cho bảng VOUCHER_CONSTRAINT (4 dòng)
INSERT INTO VOUCHER_CONSTRAINT (VoucherID, Type, Above, Below) VALUES
('VCH001', 'MinOrder', 100000.00, 500000.00),
('VCH002', 'MinOrder', 150000.00, 1000000.00),
('VCH003', 'MinOrder', 200000.00, 2000000.00),
('VCH004', 'MinOrder', 500000.00, 3000000.00);

-- Chèn dữ liệu mẫu cho bảng FOOD_AND_DRINK (4 dòng)
INSERT INTO FOOD_AND_DRINK (ItemID, Type, Name, StockQuantity, IsAvailable, Price) VALUES
('FAD001', 'POPCORN', 'Salted Popcorn', 100, TRUE, 50000.00),
('FAD002', 'POPCORN', 'Caramel Popcorn', 80, TRUE, 60000.00),
('FAD003', 'DRINK', 'Cola', 200, TRUE, 30000.00),
('FAD004', 'DRINK', 'Pepsi', 150, TRUE, 30000.00);

-- Chèn dữ liệu mẫu cho bảng FOOD_DRINK_ORDER (4 dòng)
INSERT INTO FOOD_DRINK_ORDER (OrderID, ItemID, Quantity) VALUES
('ORD002', 'FAD001', 2),
('ORD002', 'FAD003', 1),
('ORD003', 'FAD002', 1),
('ORD003', 'FAD004', 2);

-- Chèn dữ liệu mẫu cho bảng POPCORN (3 dòng, < 4 do phù hợp ngữ cảnh)
INSERT INTO POPCORN (ItemID, Flavor, Size) VALUES
('FAD001', 'Salted', 'Medium'),
('FAD002', 'Caramel', 'Large'),
('FAD003', 'Cheese', 'Small');

-- Chèn dữ liệu mẫu cho bảng DRINK (3 dòng, < 4 do phù hợp ngữ cảnh)
INSERT INTO DRINK (ItemID, Size) VALUES
('FAD003', 'Medium'),
('FAD004', 'Large');


SELECT * from showtime;
-- SELECT * from MOVIE;
-- SELECT * from movie_genre;

-- SELECT 
--       c.CinemaID,
--       c.Name,
--       TIME_FORMAT(c.OpeningHours, '%H:%i') AS OpeningHours,
--       TIME_FORMAT(c.ClosingHours, '%H:%i') AS ClosingHours,
--       c.Location,
--       COALESCE(GROUP_CONCAT(cp.PhoneNumber), '') AS PhoneNumbers
--     FROM CINEMA c
--     LEFT JOIN CINEMA_PHONE cp ON c.CinemaID = cp.CinemaID
--     GROUP BY c.CinemaID, c.Name, c.OpeningHours, c.ClosingHours, c.Location
    
-- DELIMITER $$
-- CREATE FUNCTION CalculateMovieRevenue(
--     p_MovieID CHAR(6),
--     p_StartDate DATE,
--     p_EndDate DATE
-- ) RETURNS DECIMAL(10,2)
-- DETERMINISTIC
-- BEGIN
--     DECLARE v_TotalRevenue DECIMAL(10,2);
    
--     -- Input validation
--     IF p_MovieID IS NULL OR p_MovieID NOT IN (SELECT MovieID FROM MOVIE) THEN
--         SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid MovieID';
--     END IF;
--     IF p_StartDate IS NULL OR p_EndDate IS NULL OR p_StartDate > p_EndDate THEN
--         SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid date range';
--     END IF;
    
--     -- Calculate total revenue from SHOWTIME_SEAT
--     SELECT SUM(ss.Price) INTO v_TotalRevenue
--     FROM SHOWTIME_SEAT ss
--     JOIN SHOWTIME s ON ss.RoomID = s.RoomID AND ss.MovieID = s.MovieID AND ss.StartTime = s.StartTime
--     JOIN `ORDER` o ON ss.OrderID = o.OrderID
--     WHERE ss.MovieID = p_MovieID
--     AND o.Date BETWEEN p_StartDate AND p_EndDate
--     AND o.Status = 'Completed';
    
--     RETURN IFNULL(v_TotalRevenue, 0.00);
-- END$$
-- DELIMITER ;

-- -- FUNCTION 2: Get available seats count for a showtime
-- -- Input: RoomID (INT), MovieID (CHAR(6)), StartTime (DATETIME)
-- -- Output: INT - Number of available seats
-- -- Requirements: WHERE, JOIN, GROUP BY, input validation
-- DELIMITER $$
-- CREATE FUNCTION GetAvailableSeats(
--     p_RoomID INT,
--     p_MovieID CHAR(6),
--     p_StartTime DATETIME
-- ) RETURNS INT
-- DETERMINISTIC
-- BEGIN
--     DECLARE v_AvailableSeats INT;
    
--     -- Input validation
--     IF p_RoomID IS NULL OR p_MovieID IS NULL OR p_StartTime IS NULL THEN
--         SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid input parameters';
--     END IF;
--     IF NOT EXISTS (
--         SELECT 1 FROM SHOWTIME 
--         WHERE RoomID = p_RoomID AND MovieID = p_MovieID AND StartTime = p_StartTime
--     ) THEN
--         SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid showtime';
--     END IF;
    
--     -- Count available seats
--     SELECT COUNT(*) INTO v_AvailableSeats
--     FROM SHOWTIME_SEAT ss
--     JOIN SEAT s ON ss.SeatNumber = s.SeatNumber AND ss.RoomID = s.RoomNumber
--     WHERE ss.RoomID = p_RoomID
--     AND ss.MovieID = p_MovieID
--     AND ss.StartTime = p_StartTime
--     AND ss.Status = 'Available'
--     GROUP BY ss.RoomID, ss.MovieID, ss.StartTime;
    
--     RETURN IFNULL(v_AvailableSeats, 0);
-- END$$
-- DELIMITER ;

-- -- FUNCTION 3: Get upcoming showtimes for a movie
-- -- Input: MovieID (CHAR(6)), CurrentDate (DATETIME)
-- -- Output: TEXT - List of upcoming showtimes
-- DELIMITER $$
-- CREATE FUNCTION GetUpcomingShowtimes(
--     p_MovieID CHAR(6),
--     p_CurrentDate DATETIME
-- ) RETURNS TEXT
-- DETERMINISTIC
-- BEGIN
--     DECLARE v_Showtimes TEXT;

--     -- Lấy danh sách suất chiếu
--     SELECT GROUP_CONCAT(CONCAT(StartTime, ' in Room ', RoomID) SEPARATOR '; ')
--     INTO v_Showtimes
--     FROM SHOWTIME
--     WHERE MovieID = p_MovieID
--     AND StartTime > p_CurrentDate;

--     RETURN IFNULL(v_Showtimes, 'No upcoming showtimes');
-- END$$
-- DELIMITER ;


-- -- PROCEDURE 1: Get top customers by spending
-- -- Input: CinemaID (CHAR(6)), MinOrders (INT), LimitCount (INT)
-- -- Output: Result set with CustomerID, FullName, TotalSpent, TotalOrders
-- -- Requirements: Aggregate function, GROUP BY, HAVING, WHERE, ORDER BY, JOIN, IF
-- DELIMITER $$
-- CREATE PROCEDURE GetTopCustomersBySpending(
--     IN p_CinemaID CHAR(6),
--     IN p_MinOrders INT,
--     IN p_LimitCount INT
-- )
-- BEGIN
--     -- Input validation
--     IF p_CinemaID IS NULL OR p_CinemaID NOT IN (SELECT CinemaID FROM CINEMA) THEN
--         SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid CinemaID';
--     END IF;
--     IF p_MinOrders < 0 THEN
--         SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'MinOrders must be non-negative';
--     END IF;
--     IF p_LimitCount <= 0 THEN
--         SET p_LimitCount = 10; -- Default to 10 if invalid
--     END IF;
    
--     -- Query top customers
--     SELECT 
--         c.CustomerID,
--         c.FullName,
--         SUM(o.TotalPrice) AS TotalSpent,
--         COUNT(o.OrderID) AS TotalOrders
--     FROM CUSTOMER c
--     JOIN `ORDER` o ON c.CustomerID = o.CustomerID
--     JOIN SHOWTIME_SEAT ss ON o.OrderID = ss.OrderID
--     JOIN SHOWTIME s ON ss.RoomID = s.RoomID AND ss.MovieID = s.MovieID AND ss.StartTime = s.StartTime
--     JOIN ROOM r ON s.RoomID = r.RoomNumber AND r.CinemaID = p_CinemaID
--     WHERE o.Status = 'Completed'
--     GROUP BY c.CustomerID, c.FullName
--     HAVING COUNT(o.OrderID) >= p_MinOrders
--     ORDER BY TotalSpent DESC
--     LIMIT p_LimitCount;
-- END$$
-- DELIMITER ;

-- -- PROCEDURE 2: Update food stock after order
-- -- Input: OrderID (INT)
-- -- Output: None (updates FOOD_AND_DRINK.StockQuantity)
-- -- Requirements: FOR loop, JOIN, IF, WHERE
-- DELIMITER $$
-- CREATE PROCEDURE UpdateFoodStockAfterOrder(
--     IN p_OrderID INT
-- )
-- BEGIN
--     DECLARE v_ItemID CHAR(6);
--     DECLARE v_Quantity INT;
--     DECLARE v_Stock INT;
--     DECLARE done INT DEFAULT FALSE;
    
--     -- Cursor for food items in the order
--     DECLARE food_cursor CURSOR FOR
--         SELECT ItemID, Quantity
--         FROM FOOD_DRINK_ORDER
--         WHERE OrderID = p_OrderID;
    
--     DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
--     -- Input validation
--     IF p_OrderID IS NULL OR p_OrderID NOT IN (SELECT OrderID FROM `ORDER`) THEN
--         SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid OrderID';
--     END IF;
    
--     -- Open cursor and loop through food items
--     OPEN food_cursor;
--     read_loop: LOOP
--         FETCH food_cursor INTO v_ItemID, v_Quantity;
--         IF done THEN
--             LEAVE read_loop;
--         END IF;
        
--         -- Check current stock
--         SELECT StockQuantity INTO v_Stock
--         FROM FOOD_AND_DRINK
--         WHERE ItemID = v_ItemID;
        
--         -- Update stock if sufficient
--         IF v_Stock >= v_Quantity THEN
--             UPDATE FOOD_AND_DRINK
--             SET StockQuantity = StockQuantity - v_Quantity
--             WHERE ItemID = v_ItemID;
--         ELSE
--             SIGNAL SQLSTATE '45000' ;
--             SET MESSAGE_TEXT = CONCAT('Insufficient stock for item ', v_ItemID);
--         END IF;
--     END LOOP;
--     CLOSE food_cursor;
-- END$$
-- DELIMITER ;

-- -- TRIGGER 1: Update CUSTOMER TotalSpent and TotalOrders on ORDER insert
-- -- Purpose: Generate derived column values (TotalSpent, TotalOrders)
-- -- Triggered: After INSERT on ORDER
-- DELIMITER $$
-- CREATE TRIGGER AfterOrderInsert
-- AFTER INSERT ON `ORDER`
-- FOR EACH ROW
-- BEGIN
--     UPDATE CUSTOMER
--     SET TotalSpent = TotalSpent + NEW.TotalPrice,
--         TotalOrders = TotalOrders + 1
--     WHERE CustomerID = NEW.CustomerID;
-- END$$
-- DELIMITER ;

-- -- TRIGGER 2: Enforce business rule - Prevent booking seats for past showtimes
-- -- Purpose: Business rule - Cannot book seats for showtimes that have already occurred
-- -- Triggered: Before INSERT on SHOWTIME_SEAT
-- DELIMITER $$
-- CREATE TRIGGER BeforeShowtimeSeatInsert
-- BEFORE INSERT ON SHOWTIME_SEAT
-- FOR EACH ROW
-- BEGIN
--     DECLARE v_Showtime DATETIME;
    
--     -- Get showtime
--     SELECT StartTime INTO v_Showtime
--     FROM SHOWTIME
--     WHERE RoomID = NEW.RoomID
--     AND MovieID = NEW.MovieID
--     AND StartTime = NEW.StartTime;
    
--     -- Check if showtime is in the past
--     IF v_Showtime < NOW() THEN
--         SIGNAL SQLSTATE '45000'
--         SET MESSAGE_TEXT = 'Cannot book seats for past showtimes';
--     END IF;
-- END$$
-- DELIMITER ;


-- -- TRIGGER 3: Update SHOWTIME_SEAT status on ORDER cancellation
-- -- Purpose: Update seat status to 'Available' when an order is cancelled
-- -- Triggered: After UPDATE on ORDER
-- DELIMITER $$
-- CREATE TRIGGER AfterOrderCancel
-- AFTER UPDATE ON `ORDER`
-- FOR EACH ROW
-- BEGIN
--     IF NEW.Status = 'Cancelled' THEN
--         UPDATE SHOWTIME_SEAT
--         SET Status = 'Available', OrderID = NULL
--         WHERE OrderID = OLD.OrderID;
--     END IF;
-- END$$
-- DELIMITER ;

-- -- TRIGGER 4: Prevent booking if no available seats
-- -- Purpose: Business rule - Prevent booking if no available seats
-- -- Triggered: Before INSERT on SHOWTIME_SEAT
-- DELIMITER $$
-- CREATE TRIGGER BeforeSeatBooking
-- BEFORE INSERT ON SHOWTIME_SEAT
-- FOR EACH ROW
-- BEGIN
--     DECLARE v_AvailableSeats INT;

--     -- Đếm số ghế trống
--     SELECT COUNT(*) INTO v_AvailableSeats
--     FROM SHOWTIME_SEAT
--     WHERE RoomID = NEW.RoomID
--     AND MovieID = NEW.MovieID
--     AND StartTime = NEW.StartTime
--     AND Status = 'Available';

--     -- Kiểm tra nếu không còn ghế trống
--     IF v_AvailableSeats = 0 THEN
--         SIGNAL SQLSTATE '45000'
--         SET MESSAGE_TEXT = 'No available seats for this showtime';
--     END IF;
-- END$$
-- DELIMITER ;