-- Tạo database
CREATE DATABASE IF NOT EXISTS cinemasystem;
USE cinemasystem;

DROP database cinemasystem;
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
    TotalOrders INT NOT NULL DEFAULT 0 CHECK (TotalOrders >= 0),
    Password VARCHAR(255) NOT NULL DEFAULT '123456789'
);

-- PREFIX INCREMENT
CREATE TABLE ID_COUNTER (
    Prefix VARCHAR(3) PRIMARY KEY,
    Counter INT NOT NULL DEFAULT 0
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
    SeatNumber CHAR(3) NOT NULL,
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
    isShow BOOLEAN NOT NULL DEFAULT 0
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
    SeatNumber CHAR(3) NOT NULL,
    OrderID CHAR(6),
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
    Type ENUM("TotalOrderPrice", "MaxValue", "TotalSpent"),
    Above FLOAT,
    Below FLOAT,
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

-- MANAGER
CREATE TABLE MANAGER (
    Username VARCHAR(255) PRIMARY KEY,
    Password VARCHAR(255) NOT NULL
);

-- ----------------------------------------------------------------
-- TRIGGER FOR PREFIX
DELIMITER //

-- Trigger cho CINEMA
CREATE TRIGGER before_cinema_insert
BEFORE INSERT ON CINEMA
FOR EACH ROW
BEGIN
    DECLARE new_id VARCHAR(6);
    DECLARE next_number INT;
    UPDATE ID_COUNTER SET Counter = Counter + 1 WHERE Prefix = 'CIN';
    SELECT Counter INTO next_number FROM ID_COUNTER WHERE Prefix = 'CIN';
    SET new_id = CONCAT('CIN', LPAD(next_number, 3, '0'));
    SET NEW.CinemaID = new_id;
END//

-- Trigger cho CUSTOMER
CREATE TRIGGER before_customer_insert
BEFORE INSERT ON CUSTOMER
FOR EACH ROW
BEGIN
    DECLARE new_id VARCHAR(6);
    DECLARE next_number INT;
    UPDATE ID_COUNTER SET Counter = Counter + 1 WHERE Prefix = 'CUS';
    SELECT Counter INTO next_number FROM ID_COUNTER WHERE Prefix = 'CUS';
    SET new_id = CONCAT('CUS', LPAD(next_number, 3, '0'));
    SET NEW.CustomerID = new_id;
END//

-- Trigger cho MOVIE
CREATE TRIGGER before_movie_insert
BEFORE INSERT ON MOVIE
FOR EACH ROW
BEGIN
    DECLARE new_id VARCHAR(6);
    DECLARE next_number INT;
    UPDATE ID_COUNTER SET Counter = Counter + 1 WHERE Prefix = 'MOV';
    SELECT Counter INTO next_number FROM ID_COUNTER WHERE Prefix = 'MOV';
    SET new_id = CONCAT('MOV', LPAD(next_number, 3, '0'));
    SET NEW.MovieID = new_id;
END//

-- Trigger cho SHOWTIME
CREATE TRIGGER before_showtime_insert_id
BEFORE INSERT ON SHOWTIME
FOR EACH ROW
BEGIN
    DECLARE new_id VARCHAR(6);
    DECLARE next_number INT;
    UPDATE ID_COUNTER SET Counter = Counter + 1 WHERE Prefix = 'SHT';
    SELECT Counter INTO next_number FROM ID_COUNTER WHERE Prefix = 'SHT';
    SET new_id = CONCAT('SHT', LPAD(next_number, 3, '0'));
    SET NEW.ShowTimeID = new_id;
END//

-- Trigger cho VOUCHER
CREATE TRIGGER before_voucher_insert
BEFORE INSERT ON VOUCHER
FOR EACH ROW
BEGIN
    DECLARE new_id VARCHAR(6);
    DECLARE next_number INT;
    UPDATE ID_COUNTER SET Counter = Counter + 1 WHERE Prefix = 'VCH';
    SELECT Counter INTO next_number FROM ID_COUNTER WHERE Prefix = 'VCH';
    SET new_id = CONCAT('VCH', LPAD(next_number, 3, '0'));
    SET NEW.VoucherID = new_id;
END//

-- Trigger cho ORDERS
CREATE TRIGGER before_orders_insert
BEFORE INSERT ON ORDERS
FOR EACH ROW
BEGIN
    DECLARE new_id VARCHAR(6);
    DECLARE next_number INT;
    UPDATE ID_COUNTER SET Counter = Counter + 1 WHERE Prefix = 'ORD';
    SELECT Counter INTO next_number FROM ID_COUNTER WHERE Prefix = 'ORD';
    SET new_id = CONCAT('ORD', LPAD(next_number, 3, '0'));
    SET NEW.OrderID = new_id;
END//

-- Trigger cho SCREEN
CREATE TRIGGER before_screen_insert
BEFORE INSERT ON SCREEN
FOR EACH ROW
BEGIN
    DECLARE new_id VARCHAR(6);
    DECLARE next_number INT;
    UPDATE ID_COUNTER SET Counter = Counter + 1 WHERE Prefix = 'SCR';
    SELECT Counter INTO next_number FROM ID_COUNTER WHERE Prefix = 'SCR';
    SET new_id = CONCAT('SCR', LPAD(next_number, 3, '0'));
    SET NEW.ScreenID = new_id;
END//

-- Trigger cho FOOD_AND_DRINK
CREATE TRIGGER before_food_and_drink_insert
BEFORE INSERT ON FOOD_AND_DRINK
FOR EACH ROW
BEGIN
    DECLARE new_id VARCHAR(6);
    DECLARE next_number INT;
    UPDATE ID_COUNTER SET Counter = Counter + 1 WHERE Prefix = 'FAD';
    SELECT Counter INTO next_number FROM ID_COUNTER WHERE Prefix = 'FAD';
    SET new_id = CONCAT('FAD', LPAD(next_number, 3, '0'));
    SET NEW.ItemID = new_id;
END//

DELIMITER ;
-- ---------------------------------------------------------------------


-- TRIGGER FOR LOGIC
DELIMITER //

CREATE TRIGGER before_showtime_insert
BEFORE INSERT ON SHOWTIME
FOR EACH ROW
BEGIN
    SET NEW.EndTime = DATE_ADD(NEW.StartTime, INTERVAL NEW.Duration MINUTE);
END//

CREATE TRIGGER before_showtime_update
BEFORE UPDATE ON SHOWTIME
FOR EACH ROW
BEGIN
    SET NEW.EndTime = DATE_ADD(NEW.StartTime, INTERVAL NEW.Duration MINUTE);
END//

DELIMITER ;

DELIMITER //

CREATE TRIGGER after_rating_insert
AFTER INSERT ON RATING
FOR EACH ROW
BEGIN
    UPDATE MOVIE
    SET CustomerRating = (
        SELECT AVG(Score)
        FROM RATING
        WHERE MovieID = NEW.MovieID
    )
    WHERE MovieID = NEW.MovieID;
END//

CREATE TRIGGER after_rating_update
AFTER UPDATE ON RATING
FOR EACH ROW
BEGIN
    UPDATE MOVIE
    SET CustomerRating = (
        SELECT AVG(Score)
        FROM RATING
        WHERE MovieID = NEW.MovieID
    )
    WHERE MovieID = NEW.MovieID;
END//

DELIMITER ;

DELIMITER //

CREATE TRIGGER after_order_insert
AFTER INSERT ON ORDERS
FOR EACH ROW
BEGIN
    UPDATE CUSTOMER
    SET TotalOrders = TotalOrders + 1
    WHERE CustomerID = NEW.CustomerID;
END//

CREATE TRIGGER after_order_update
AFTER UPDATE ON ORDERS
FOR EACH ROW
BEGIN
    DECLARE price_diff DECIMAL(10,2);
    SET price_diff = COALESCE(NEW.TotalPrice, 0.00) - COALESCE(OLD.TotalPrice, 0.00);
    
    UPDATE CUSTOMER
    SET TotalSpent = COALESCE(TotalSpent, 0.00) + price_diff
    WHERE CustomerID = NEW.CustomerID;
END//

CREATE TRIGGER before_order_insert_voucher
BEFORE INSERT ON ORDERS
FOR EACH ROW
BEGIN
    DECLARE voucher_count INT;
    DECLARE max_usage INT;
    
    IF NEW.VoucherID IS NOT NULL THEN
        SELECT UsedCount, MaxUsage INTO voucher_count, max_usage
        FROM VOUCHER
        WHERE VoucherID = NEW.VoucherID;
        
        IF voucher_count >= max_usage THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Voucher has reached maximum usage limit';
        END IF;
        
        UPDATE VOUCHER
        SET UsedCount = UsedCount + 1
        WHERE VoucherID = NEW.VoucherID;
    END IF;
END//

DELIMITER ;

DELIMITER //

CREATE TRIGGER before_food_drink_order_insert
BEFORE INSERT ON FOOD_DRINK_ORDER
FOR EACH ROW
BEGIN
    DECLARE stock INT;
    
    SELECT StockQuantity INTO stock
    FROM FOOD_AND_DRINK
    WHERE ItemID = NEW.ItemID;
    
    IF stock < NEW.Quantity THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Insufficient stock for the requested food/drink item';
    END IF;
    
    UPDATE FOOD_AND_DRINK
    SET StockQuantity = StockQuantity - NEW.Quantity
    WHERE ItemID = NEW.ItemID;
END//

CREATE TRIGGER after_food_drink_order_insert_orders
AFTER INSERT ON FOOD_DRINK_ORDER
FOR EACH ROW
BEGIN
    DECLARE item_price DECIMAL(10,2);
    DECLARE total_cost DECIMAL(10,2);
    
    SELECT Price INTO item_price
    FROM FOOD_AND_DRINK
    WHERE ItemID = NEW.ItemID;
    
    SET total_cost = NEW.Quantity * item_price;
    
    UPDATE ORDERS
    SET TotalPrice = COALESCE(TotalPrice, 0.00) + total_cost,
        isFood = TRUE
    WHERE OrderID = NEW.OrderID;
END//

DELIMITER ;

-- Mới tìm thấy
DELIMITER //

CREATE TRIGGER before_showtime_seat_update
BEFORE UPDATE ON SHOWTIME_SEAT
FOR EACH ROW
BEGIN
    IF OLD.OrderID IS NOT NULL AND NEW.OrderID <> OLD.OrderID THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'OrderID đã tồn tại, không được cập nhật';
    END IF;
END//

CREATE TRIGGER after_showtime_seat_update
AFTER UPDATE ON SHOWTIME_SEAT
FOR EACH ROW
BEGIN
    UPDATE ORDERS
    SET TotalPrice = COALESCE(TotalPrice, 0.00) + NEW.Price,
        isTicket = TRUE
    WHERE OrderID = NEW.OrderID;
END//

DELIMITER ;

-- ---------------------------------------------------------------------
-- Trigger tự động thêm SHOWTIME_SEAT sau khi tạo SHOWTIME mới

DELIMITER //
CREATE TRIGGER after_showtime_insert_seats
AFTER INSERT ON SHOWTIME
FOR EACH ROW
BEGIN
    INSERT INTO SHOWTIME_SEAT (ShowTimeID, SeatNumber, OrderID, Price)
    SELECT
        NEW.ShowTimeID,
        S.SeatNumber,
        NULL,
        CASE
            WHEN S.SeatType = 'Standard' THEN 
                100000
                + CASE WHEN DAYOFWEEK(NEW.StartTime) IN (1, 7) THEN 50000 ELSE 0 END
                + CASE WHEN NEW.Format <> '2D' THEN 50000 ELSE 0 END
            ELSE
                200000
                + CASE WHEN DAYOFWEEK(NEW.StartTime) IN (1, 7) THEN 50000 ELSE 0 END
                + CASE WHEN NEW.Format <> '2D' THEN 50000 ELSE 0 END
        END AS Price
    FROM SEAT S
    WHERE S.CinemaID = NEW.CinemaID
      AND S.RoomNumber = NEW.RoomNumber;
END//

DELIMITER ;


-- INSERT --
SET SQL_SAFE_UPDATES = 0;

INSERT INTO MANAGER (Username, Password) VALUES
('admin', 'admin123'),
('Haodeptrai', 'Haodeptrai123');

INSERT INTO ID_COUNTER (Prefix, Counter) VALUES
('CIN', 0), -- CinemaID
('CUS', 0), -- CustomerID
('MOV', 0), -- MovieID
('SHT', 0), -- ShowTimeID
('VCH', 0), -- VoucherID
('ORD', 0), -- OrderID
('SCR', 0), -- ScreenID
('FAD', 0); -- FoodAndDrinkID

INSERT INTO CINEMA (Name, OpeningHours, ClosingHours, Location) VALUES
('Galaxy Nguyen Hue', '08:00:00', '23:00:00', '123 Nguyen Hue, District 1, HCMC'),
('CGV Vincom', '09:00:00', '22:30:00', '456 Le Loi, District 3, HCMC'),
('Lotte Diamond', '08:30:00', '23:30:00', '789 Dien Bien Phu, Binh Thanh, HCMC'),
('BHD Star', '09:00:00', '22:00:00', '101 Vo Van Tan, District 3, HCMC'),
('Starlight Cinema', '09:00:00', '23:00:00', '321 Pham Van Dong, Binh Thanh, HCMC'),
('Mega GS', '08:00:00', '22:00:00', '654 Ba Thang Hai, District 10, HCMC'),
('Cineplex Nguyen Trai', '10:00:00', '00:00:00', '987 Nguyen Trai, District 5, HCMC'),
('Royal Cinema', '09:30:00', '23:30:00', '111 Ly Thuong Kiet, District 11, HCMC'),
('Viva Cinema', '08:30:00', '22:30:00', '222 Tran Phu, District 6, HCMC'),
('Platinum Cine', '09:00:00', '23:00:00', '333 Nguyen Thi Minh Khai, District 3, HCMC'),
('Sky Cinema', '10:00:00', '00:30:00', '444 Cach Mang Thang Tam, District 1, HCMC'),
('Aurora Cinema', '08:00:00', '22:00:00', '555 Le Van Sy, Tan Binh, HCMC'),
('Golden Cine', '09:00:00', '23:00:00', '666 Truong Chinh, Tan Phu, HCMC'),
('Diamond Cinema', '09:30:00', '23:30:00', '777 Nguyen Van Linh, District 7, HCMC');

INSERT INTO CINEMA_PHONE (PhoneNumber, CinemaID) VALUES
('0901234567', 'CIN001'),
('0902345678', 'CIN002'),
('0903456789', 'CIN003'),
('0904567890', 'CIN004'),
('0905678901', 'CIN005'),
('0906789012', 'CIN006'),
('0907890123', 'CIN007'),
('0908901234', 'CIN008'),
('0909012345', 'CIN009'),
('0910123456', 'CIN010'),
('0911234567', 'CIN011'),
('0912345678', 'CIN012'),
('0913456789', 'CIN013'),
('0914567890', 'CIN014');

INSERT INTO SCREEN (Size, Type, SupportedFormat) VALUES
('Large', 'IMAX', '2D, 3D, IMAX'),
('Medium', 'Standard', '2D, 3D'),
('Small', 'Standard', '2D'),
('Large', '4DX', '2D, 3D, 4DX'),
('Medium', 'Standard', '2D, 3D'),
('Large', 'IMAX', '2D, 3D, IMAX'),
('Small', 'Standard', '2D'),
('Large', '4DX', '2D, 3D, 4DX'),
('Medium', 'Standard', '2D, 3D'),
('Large', 'IMAX', '2D, 3D, IMAX'),
('Small', 'Standard', '2D'),
('Large', '4DX', '2D, 3D, 4DX'),
('Medium', 'Standard', '2D, 3D'),
('Large', 'IMAX', '2D, 3D, IMAX');

INSERT INTO ROOM (CinemaID, RoomNumber, Capacity, Type, ScreenID) VALUES
('CIN001', 1, 150, 'Standard', 'SCR002'),
('CIN001', 2, 200, 'IMAX', 'SCR001'),
('CIN002', 1, 100, 'Standard', 'SCR003'),
('CIN002', 2, 180, '4DX', 'SCR004'),
('CIN003', 1, 120, 'Standard', 'SCR005'),
('CIN003', 2, 160, 'VIP', 'SCR006'),
('CIN004', 1, 80, 'Standard', 'SCR007'),
('CIN004', 2, 150, 'IMAX', 'SCR008'),
('CIN005', 1, 130, 'Standard', 'SCR009'),
('CIN005', 2, 170, '4DX', 'SCR010'),
('CIN006', 1, 90, 'Standard', 'SCR011'),
('CIN006', 2, 200, 'VIP', 'SCR012'),
('CIN007', 1, 110, 'Standard', 'SCR013'),
('CIN007', 2, 180, 'IMAX', 'SCR014'),
('CIN008', 1, 100, 'Standard', 'SCR002'),
('CIN008', 2, 160, '4DX', 'SCR004'),
('CIN009', 1, 120, 'Standard', 'SCR005'),
('CIN009', 2, 150, 'VIP', 'SCR006'),
('CIN010', 1, 80, 'Standard', 'SCR007'),
('CIN010', 2, 170, 'IMAX', 'SCR008'),
('CIN011', 1, 130, 'Standard', 'SCR009'),
('CIN011', 2, 190, '4DX', 'SCR010'),
('CIN012', 1, 100, 'Standard', 'SCR011'),
('CIN012', 2, 180, 'VIP', 'SCR012');

INSERT INTO SEAT (CinemaID, RoomNumber, SeatNumber, SeatType) VALUES
-- CIN001, Room 1
('CIN001', 1, 'A1', 'Standard'), ('CIN001', 1, 'A2', 'Standard'), ('CIN001', 1, 'A3', 'Standard'), ('CIN001', 1, 'A4', 'Standard'), ('CIN001', 1, 'A5', 'Standard'),
('CIN001', 1, 'B1', 'VIP'), ('CIN001', 1, 'B2', 'VIP'), ('CIN001', 1, 'B3', 'VIP'), ('CIN001', 1, 'B4', 'VIP'), ('CIN001', 1, 'B5', 'VIP'),
('CIN001', 1, 'C1', 'Standard'), ('CIN001', 1, 'C2', 'Standard'), ('CIN001', 1, 'C3', 'Standard'), ('CIN001', 1, 'C4', 'Standard'), ('CIN001', 1, 'C5', 'Standard'),
('CIN001', 1, 'D1', 'VIP'), ('CIN001', 1, 'D2', 'VIP'), ('CIN001', 1, 'D3', 'VIP'), ('CIN001', 1, 'D4', 'VIP'), ('CIN001', 1, 'D5', 'VIP'),
-- CIN001, Room 2
('CIN001', 2, 'A1', 'Standard'), ('CIN001', 2, 'A2', 'Standard'), ('CIN001', 2, 'A3', 'Standard'), ('CIN001', 2, 'A4', 'Standard'), ('CIN001', 2, 'A5', 'Standard'),
('CIN001', 2, 'B1', 'VIP'), ('CIN001', 2, 'B2', 'VIP'), ('CIN001', 2, 'B3', 'VIP'), ('CIN001', 2, 'B4', 'VIP'), ('CIN001', 2, 'B5', 'VIP'),
('CIN001', 2, 'C1', 'Standard'), ('CIN001', 2, 'C2', 'Standard'), ('CIN001', 2, 'C3', 'Standard'), ('CIN001', 2, 'C4', 'Standard'), ('CIN001', 2, 'C5', 'Standard'),
('CIN001', 2, 'D1', 'VIP'), ('CIN001', 2, 'D2', 'VIP'), ('CIN001', 2, 'D3', 'VIP'), ('CIN001', 2, 'D4', 'VIP'), ('CIN001', 2, 'D5', 'VIP'),
-- CIN002, Room 1
('CIN002', 1, 'A1', 'Standard'), ('CIN002', 1, 'A2', 'Standard'), ('CIN002', 1, 'A3', 'Standard'), ('CIN002', 1, 'A4', 'Standard'), ('CIN002', 1, 'A5', 'Standard'),
('CIN002', 1, 'B1', 'VIP'), ('CIN002', 1, 'B2', 'VIP'), ('CIN002', 1, 'B3', 'VIP'), ('CIN002', 1, 'B4', 'VIP'), ('CIN002', 1, 'B5', 'VIP'),
('CIN002', 1, 'C1', 'Standard'), ('CIN002', 1, 'C2', 'Standard'), ('CIN002', 1, 'C3', 'Standard'), ('CIN002', 1, 'C4', 'Standard'), ('CIN002', 1, 'C5', 'Standard'),
('CIN002', 1, 'D1', 'VIP'), ('CIN002', 1, 'D2', 'VIP'), ('CIN002', 1, 'D3', 'VIP'), ('CIN002', 1, 'D4', 'VIP'), ('CIN002', 1, 'D5', 'VIP'),
-- CIN002, Room 2
('CIN002', 2, 'A1', 'Standard'), ('CIN002', 2, 'A2', 'Standard'), ('CIN002', 2, 'A3', 'Standard'), ('CIN002', 2, 'A4', 'Standard'), ('CIN002', 2, 'A5', 'Standard'),
('CIN002', 2, 'B1', 'VIP'), ('CIN002', 2, 'B2', 'VIP'), ('CIN002', 2, 'B3', 'VIP'), ('CIN002', 2, 'B4', 'VIP'), ('CIN002', 2, 'B5', 'VIP'),
('CIN002', 2, 'C1', 'Standard'), ('CIN002', 2, 'C2', 'Standard'), ('CIN002', 2, 'C3', 'Standard'), ('CIN002', 2, 'C4', 'Standard'), ('CIN002', 2, 'C5', 'Standard'),
('CIN002', 2, 'D1', 'VIP'), ('CIN002', 2, 'D2', 'VIP'), ('CIN002', 2, 'D3', 'VIP'), ('CIN002', 2, 'D4', 'VIP'), ('CIN002', 2, 'D5', 'VIP'),
-- CIN003, Room 1
('CIN003', 1, 'A1', 'Standard'), ('CIN003', 1, 'A2', 'Standard'), ('CIN003', 1, 'A3', 'Standard'), ('CIN003', 1, 'A4', 'Standard'), ('CIN003', 1, 'A5', 'Standard'),
('CIN003', 1, 'B1', 'VIP'), ('CIN003', 1, 'B2', 'VIP'), ('CIN003', 1, 'B3', 'VIP'), ('CIN003', 1, 'B4', 'VIP'), ('CIN003', 1, 'B5', 'VIP'),
('CIN003', 1, 'C1', 'Standard'), ('CIN003', 1, 'C2', 'Standard'), ('CIN003', 1, 'C3', 'Standard'), ('CIN003', 1, 'C4', 'Standard'), ('CIN003', 1, 'C5', 'Standard'),
('CIN003', 1, 'D1', 'VIP'), ('CIN003', 1, 'D2', 'VIP'), ('CIN003', 1, 'D3', 'VIP'), ('CIN003', 1, 'D4', 'VIP'), ('CIN003', 1, 'D5', 'VIP'),
-- CIN003, Room 2
('CIN003', 2, 'A1', 'Standard'), ('CIN003', 2, 'A2', 'Standard'), ('CIN003', 2, 'A3', 'Standard'), ('CIN003', 2, 'A4', 'Standard'), ('CIN003', 2, 'A5', 'Standard'),
('CIN003', 2, 'B1', 'VIP'), ('CIN003', 2, 'B2', 'VIP'), ('CIN003', 2, 'B3', 'VIP'), ('CIN003', 2, 'B4', 'VIP'), ('CIN003', 2, 'B5', 'VIP'),
('CIN003', 2, 'C1', 'Standard'), ('CIN003', 2, 'C2', 'Standard'), ('CIN003', 2, 'C3', 'Standard'), ('CIN003', 2, 'C4', 'Standard'), ('CIN003', 2, 'C5', 'Standard'),
('CIN003', 2, 'D1', 'VIP'), ('CIN003', 2, 'D2', 'VIP'), ('CIN003', 2, 'D3', 'VIP'), ('CIN003', 2, 'D4', 'VIP'), ('CIN003', 2, 'D5', 'VIP'),
-- CIN004, Room 1
('CIN004', 1, 'A1', 'Standard'), ('CIN004', 1, 'A2', 'Standard'), ('CIN004', 1, 'A3', 'Standard'), ('CIN004', 1, 'A4', 'Standard'), ('CIN004', 1, 'A5', 'Standard'),
('CIN004', 1, 'B1', 'VIP'), ('CIN004', 1, 'B2', 'VIP'), ('CIN004', 1, 'B3', 'VIP'), ('CIN004', 1, 'B4', 'VIP'), ('CIN004', 1, 'B5', 'VIP'),
('CIN004', 1, 'C1', 'Standard'), ('CIN004', 1, 'C2', 'Standard'), ('CIN004', 1, 'C3', 'Standard'), ('CIN004', 1, 'C4', 'Standard'), ('CIN004', 1, 'C5', 'Standard'),
('CIN004', 1, 'D1', 'VIP'), ('CIN004', 1, 'D2', 'VIP'), ('CIN004', 1, 'D3', 'VIP'), ('CIN004', 1, 'D4', 'VIP'), ('CIN004', 1, 'D5', 'VIP'),
-- CIN004, Room 2
('CIN004', 2, 'A1', 'Standard'), ('CIN004', 2, 'A2', 'Standard'), ('CIN004', 2, 'A3', 'Standard'), ('CIN004', 2, 'A4', 'Standard'), ('CIN004', 2, 'A5', 'Standard'),
('CIN004', 2, 'B1', 'VIP'), ('CIN004', 2, 'B2', 'VIP'), ('CIN004', 2, 'B3', 'VIP'), ('CIN004', 2, 'B4', 'VIP'), ('CIN004', 2, 'B5', 'VIP'),
('CIN004', 2, 'C1', 'Standard'), ('CIN004', 2, 'C2', 'Standard'), ('CIN004', 2, 'C3', 'Standard'), ('CIN004', 2, 'C4', 'Standard'), ('CIN004', 2, 'C5', 'Standard'),
('CIN004', 2, 'D1', 'VIP'), ('CIN004', 2, 'D2', 'VIP'), ('CIN004', 2, 'D3', 'VIP'), ('CIN004', 2, 'D4', 'VIP'), ('CIN004', 2, 'D5', 'VIP'),
-- CIN005, Room 1
('CIN005', 1, 'A1', 'Standard'), ('CIN005', 1, 'A2', 'Standard'), ('CIN005', 1, 'A3', 'Standard'), ('CIN005', 1, 'A4', 'Standard'), ('CIN005', 1, 'A5', 'Standard'),
('CIN005', 1, 'B1', 'VIP'), ('CIN005', 1, 'B2', 'VIP'), ('CIN005', 1, 'B3', 'VIP'), ('CIN005', 1, 'B4', 'VIP'), ('CIN005', 1, 'B5', 'VIP'),
('CIN005', 1, 'C1', 'Standard'), ('CIN005', 1, 'C2', 'Standard'), ('CIN005', 1, 'C3', 'Standard'), ('CIN005', 1, 'C4', 'Standard'), ('CIN005', 1, 'C5', 'Standard'),
('CIN005', 1, 'D1', 'VIP'), ('CIN005', 1, 'D2', 'VIP'), ('CIN005', 1, 'D3', 'VIP'), ('CIN005', 1, 'D4', 'VIP'), ('CIN005', 1, 'D5', 'VIP'),
-- CIN005, Room 2
('CIN005', 2, 'A1', 'Standard'), ('CIN005', 2, 'A2', 'Standard'), ('CIN005', 2, 'A3', 'Standard'), ('CIN005', 2, 'A4', 'Standard'), ('CIN005', 2, 'A5', 'Standard'),
('CIN005', 2, 'B1', 'VIP'), ('CIN005', 2, 'B2', 'VIP'), ('CIN005', 2, 'B3', 'VIP'), ('CIN005', 2, 'B4', 'VIP'), ('CIN005', 2, 'B5', 'VIP'),
('CIN005', 2, 'C1', 'Standard'), ('CIN005', 2, 'C2', 'Standard'), ('CIN005', 2, 'C3', 'Standard'), ('CIN005', 2, 'C4', 'Standard'), ('CIN005', 2, 'C5', 'Standard'),
('CIN005', 2, 'D1', 'VIP'), ('CIN005', 2, 'D2', 'VIP'), ('CIN005', 2, 'D3', 'VIP'), ('CIN005', 2, 'D4', 'VIP'), ('CIN005', 2, 'D5', 'VIP'),
-- CIN006, Room 1
('CIN006', 1, 'A1', 'Standard'), ('CIN006', 1, 'A2', 'Standard'), ('CIN006', 1, 'A3', 'Standard'), ('CIN006', 1, 'A4', 'Standard'), ('CIN006', 1, 'A5', 'Standard'),
('CIN006', 1, 'B1', 'VIP'), ('CIN006', 1, 'B2', 'VIP'), ('CIN006', 1, 'B3', 'VIP'), ('CIN006', 1, 'B4', 'VIP'), ('CIN006', 1, 'B5', 'VIP'),
('CIN006', 1, 'C1', 'Standard'), ('CIN006', 1, 'C2', 'Standard'), ('CIN006', 1, 'C3', 'Standard'), ('CIN006', 1, 'C4', 'Standard'), ('CIN006', 1, 'C5', 'Standard'),
('CIN006', 1, 'D1', 'VIP'), ('CIN006', 1, 'D2', 'VIP'), ('CIN006', 1, 'D3', 'VIP'), ('CIN006', 1, 'D4', 'VIP'), ('CIN006', 1, 'D5', 'VIP'),
-- CIN006, Room 2
('CIN006', 2, 'A1', 'Standard'), ('CIN006', 2, 'A2', 'Standard'), ('CIN006', 2, 'A3', 'Standard'), ('CIN006', 2, 'A4', 'Standard'), ('CIN006', 2, 'A5', 'Standard'),
('CIN006', 2, 'B1', 'VIP'), ('CIN006', 2, 'B2', 'VIP'), ('CIN006', 2, 'B3', 'VIP'), ('CIN006', 2, 'B4', 'VIP'), ('CIN006', 2, 'B5', 'VIP'),
('CIN006', 2, 'C1', 'Standard'), ('CIN006', 2, 'C2', 'Standard'), ('CIN006', 2, 'C3', 'Standard'), ('CIN006', 2, 'C4', 'Standard'), ('CIN006', 2, 'C5', 'Standard'),
('CIN006', 2, 'D1', 'VIP'), ('CIN006', 2, 'D2', 'VIP'), ('CIN006', 2, 'D3', 'VIP'), ('CIN006', 2, 'D4', 'VIP'), ('CIN006', 2, 'D5', 'VIP'),
-- CIN007, Room 1
('CIN007', 1, 'A1', 'Standard'), ('CIN007', 1, 'A2', 'Standard'), ('CIN007', 1, 'A3', 'Standard'), ('CIN007', 1, 'A4', 'Standard'), ('CIN007', 1, 'A5', 'Standard'),
('CIN007', 1, 'B1', 'VIP'), ('CIN007', 1, 'B2', 'VIP'), ('CIN007', 1, 'B3', 'VIP'), ('CIN007', 1, 'B4', 'VIP'), ('CIN007', 1, 'B5', 'VIP'),
('CIN007', 1, 'C1', 'Standard'), ('CIN007', 1, 'C2', 'Standard'), ('CIN007', 1, 'C3', 'Standard'), ('CIN007', 1, 'C4', 'Standard'), ('CIN007', 1, 'C5', 'Standard'),
('CIN007', 1, 'D1', 'VIP'), ('CIN007', 1, 'D2', 'VIP'), ('CIN007', 1, 'D3', 'VIP'), ('CIN007', 1, 'D4', 'VIP'), ('CIN007', 1, 'D5', 'VIP'),
-- CIN007, Room 2
('CIN007', 2, 'A1', 'Standard'), ('CIN007', 2, 'A2', 'Standard'), ('CIN007', 2, 'A3', 'Standard'), ('CIN007', 2, 'A4', 'Standard'), ('CIN007', 2, 'A5', 'Standard'),
('CIN007', 2, 'B1', 'VIP'), ('CIN007', 2, 'B2', 'VIP'), ('CIN007', 2, 'B3', 'VIP'), ('CIN007', 2, 'B4', 'VIP'), ('CIN007', 2, 'B5', 'VIP'),
('CIN007', 2, 'C1', 'Standard'), ('CIN007', 2, 'C2', 'Standard'), ('CIN007', 2, 'C3', 'Standard'), ('CIN007', 2, 'C4', 'Standard'), ('CIN007', 2, 'C5', 'Standard'),
('CIN007', 2, 'D1', 'VIP'), ('CIN007', 2, 'D2', 'VIP'), ('CIN007', 2, 'D3', 'VIP'), ('CIN007', 2, 'D4', 'VIP'), ('CIN007', 2, 'D5', 'VIP'),
-- CIN008, Room 1
('CIN008', 1, 'A1', 'Standard'), ('CIN008', 1, 'A2', 'Standard'), ('CIN008', 1, 'A3', 'Standard'), ('CIN008', 1, 'A4', 'Standard'), ('CIN008', 1, 'A5', 'Standard'),
('CIN008', 1, 'B1', 'VIP'), ('CIN008', 1, 'B2', 'VIP'), ('CIN008', 1, 'B3', 'VIP'), ('CIN008', 1, 'B4', 'VIP'), ('CIN008', 1, 'B5', 'VIP'),
('CIN008', 1, 'C1', 'Standard'), ('CIN008', 1, 'C2', 'Standard'), ('CIN008', 1, 'C3', 'Standard'), ('CIN008', 1, 'C4', 'Standard'), ('CIN008', 1, 'C5', 'Standard'),
('CIN008', 1, 'D1', 'VIP'), ('CIN008', 1, 'D2', 'VIP'), ('CIN008', 1, 'D3', 'VIP'), ('CIN008', 1, 'D4', 'VIP'), ('CIN008', 1, 'D5', 'VIP'),
-- CIN008, Room 2
('CIN008', 2, 'A1', 'Standard'), ('CIN008', 2, 'A2', 'Standard'), ('CIN008', 2, 'A3', 'Standard'), ('CIN008', 2, 'A4', 'Standard'), ('CIN008', 2, 'A5', 'Standard'),
('CIN008', 2, 'B1', 'VIP'), ('CIN008', 2, 'B2', 'VIP'), ('CIN008', 2, 'B3', 'VIP'), ('CIN008', 2, 'B4', 'VIP'), ('CIN008', 2, 'B5', 'VIP'),
('CIN008', 2, 'C1', 'Standard'), ('CIN008', 2, 'C2', 'Standard'), ('CIN008', 2, 'C3', 'Standard'), ('CIN008', 2, 'C4', 'Standard'), ('CIN008', 2, 'C5', 'Standard'),
('CIN008', 2, 'D1', 'VIP'), ('CIN008', 2, 'D2', 'VIP'), ('CIN008', 2, 'D3', 'VIP'), ('CIN008', 2, 'D4', 'VIP'), ('CIN008', 2, 'D5', 'VIP'),
-- CIN009, Room 1
('CIN009', 1, 'A1', 'Standard'), ('CIN009', 1, 'A2', 'Standard'), ('CIN009', 1, 'A3', 'Standard'), ('CIN009', 1, 'A4', 'Standard'), ('CIN009', 1, 'A5', 'Standard'),
('CIN009', 1, 'B1', 'VIP'), ('CIN009', 1, 'B2', 'VIP'), ('CIN009', 1, 'B3', 'VIP'), ('CIN009', 1, 'B4', 'VIP'), ('CIN009', 1, 'B5', 'VIP'),
('CIN009', 1, 'C1', 'Standard'), ('CIN009', 1, 'C2', 'Standard'), ('CIN009', 1, 'C3', 'Standard'), ('CIN009', 1, 'C4', 'Standard'), ('CIN009', 1, 'C5', 'Standard'),
('CIN009', 1, 'D1', 'VIP'), ('CIN009', 1, 'D2', 'VIP'), ('CIN009', 1, 'D3', 'VIP'), ('CIN009', 1, 'D4', 'VIP'), ('CIN009', 1, 'D5', 'VIP'),
-- CIN009, Room 2
('CIN009', 2, 'A1', 'Standard'), ('CIN009', 2, 'A2', 'Standard'), ('CIN009', 2, 'A3', 'Standard'), ('CIN009', 2, 'A4', 'Standard'), ('CIN009', 2, 'A5', 'Standard'),
('CIN009', 2, 'B1', 'VIP'), ('CIN009', 2, 'B2', 'VIP'), ('CIN009', 2, 'B3', 'VIP'), ('CIN009', 2, 'B4', 'VIP'), ('CIN009', 2, 'B5', 'VIP'),
('CIN009', 2, 'C1', 'Standard'), ('CIN009', 2, 'C2', 'Standard'), ('CIN009', 2, 'C3', 'Standard'), ('CIN009', 2, 'C4', 'Standard'), ('CIN009', 2, 'C5', 'Standard'),
('CIN009', 2, 'D1', 'VIP'), ('CIN009', 2, 'D2', 'VIP'), ('CIN009', 2, 'D3', 'VIP'), ('CIN009', 2, 'D4', 'VIP'), ('CIN009', 2, 'D5', 'VIP'),
-- CIN010, Room 1
('CIN010', 1, 'A1', 'Standard'), ('CIN010', 1, 'A2', 'Standard'), ('CIN010', 1, 'A3', 'Standard'), ('CIN010', 1, 'A4', 'Standard'), ('CIN010', 1, 'A5', 'Standard'),
('CIN010', 1, 'B1', 'VIP'), ('CIN010', 1, 'B2', 'VIP'), ('CIN010', 1, 'B3', 'VIP'), ('CIN010', 1, 'B4', 'VIP'), ('CIN010', 1, 'B5', 'VIP'),
('CIN010', 1, 'C1', 'Standard'), ('CIN010', 1, 'C2', 'Standard'), ('CIN010', 1, 'C3', 'Standard'), ('CIN010', 1, 'C4', 'Standard'), ('CIN010', 1, 'C5', 'Standard'),
('CIN010', 1, 'D1', 'VIP'), ('CIN010', 1, 'D2', 'VIP'), ('CIN010', 1, 'D3', 'VIP'), ('CIN010', 1, 'D4', 'VIP'), ('CIN010', 1, 'D5', 'VIP'),
-- CIN010, Room 2
('CIN010', 2, 'A1', 'Standard'), ('CIN010', 2, 'A2', 'Standard'), ('CIN010', 2, 'A3', 'Standard'), ('CIN010', 2, 'A4', 'Standard'), ('CIN010', 2, 'A5', 'Standard'),
('CIN010', 2, 'B1', 'VIP'), ('CIN010', 2, 'B2', 'VIP'), ('CIN010', 2, 'B3', 'VIP'), ('CIN010', 2, 'B4', 'VIP'), ('CIN010', 2, 'B5', 'VIP'),
('CIN010', 2, 'C1', 'Standard'), ('CIN010', 2, 'C2', 'Standard'), ('CIN010', 2, 'C3', 'Standard'), ('CIN010', 2, 'C4', 'Standard'), ('CIN010', 2, 'C5', 'Standard'),
('CIN010', 2, 'D1', 'VIP'), ('CIN010', 2, 'D2', 'VIP'), ('CIN010', 2, 'D3', 'VIP'), ('CIN010', 2, 'D4', 'VIP'), ('CIN010', 2, 'D5', 'VIP'),
-- CIN011, Room 1
('CIN011', 1, 'A1', 'Standard'), ('CIN011', 1, 'A2', 'Standard'), ('CIN011', 1, 'A3', 'Standard'), ('CIN011', 1, 'A4', 'Standard'), ('CIN011', 1, 'A5', 'Standard'),
('CIN011', 1, 'B1', 'VIP'), ('CIN011', 1, 'B2', 'VIP'), ('CIN011', 1, 'B3', 'VIP'), ('CIN011', 1, 'B4', 'VIP'), ('CIN011', 1, 'B5', 'VIP'),
('CIN011', 1, 'C1', 'Standard'), ('CIN011', 1, 'C2', 'Standard'), ('CIN011', 1, 'C3', 'Standard'), ('CIN011', 1, 'C4', 'Standard'), ('CIN011', 1, 'C5', 'Standard'),
('CIN011', 1, 'D1', 'VIP'), ('CIN011', 1, 'D2', 'VIP'), ('CIN011', 1, 'D3', 'VIP'), ('CIN011', 1, 'D4', 'VIP'), ('CIN011', 1, 'D5', 'VIP'),
-- CIN011, Room 2
('CIN011', 2, 'A1', 'Standard'), ('CIN011', 2, 'A2', 'Standard'), ('CIN011', 2, 'A3', 'Standard'), ('CIN011', 2, 'A4', 'Standard'), ('CIN011', 2, 'A5', 'Standard'),
('CIN011', 2, 'B1', 'VIP'), ('CIN011', 2, 'B2', 'VIP'), ('CIN011', 2, 'B3', 'VIP'), ('CIN011', 2, 'B4', 'VIP'), ('CIN011', 2, 'B5', 'VIP'),
('CIN011', 2, 'C1', 'Standard'), ('CIN011', 2, 'C2', 'Standard'), ('CIN011', 2, 'C3', 'Standard'), ('CIN011', 2, 'C4', 'Standard'), ('CIN011', 2, 'C5', 'Standard'),
('CIN011', 2, 'D1', 'VIP'), ('CIN011', 2, 'D2', 'VIP'), ('CIN011', 2, 'D3', 'VIP'), ('CIN011', 2, 'D4', 'VIP'), ('CIN011', 2, 'D5', 'VIP'),
-- CIN012, Room 1
('CIN012', 1, 'A1', 'Standard'), ('CIN012', 1, 'A2', 'Standard'), ('CIN012', 1, 'A3', 'Standard'), ('CIN012', 1, 'A4', 'Standard'), ('CIN012', 1, 'A5', 'Standard'),
('CIN012', 1, 'B1', 'VIP'), ('CIN012', 1, 'B2', 'VIP'), ('CIN012', 1, 'B3', 'VIP'), ('CIN012', 1, 'B4', 'VIP'), ('CIN012', 1, 'B5', 'VIP'),
('CIN012', 1, 'C1', 'Standard'), ('CIN012', 1, 'C2', 'Standard'), ('CIN012', 1, 'C3', 'Standard'), ('CIN012', 1, 'C4', 'Standard'), ('CIN012', 1, 'C5', 'Standard'),
('CIN012', 1, 'D1', 'VIP'), ('CIN012', 1, 'D2', 'VIP'), ('CIN012', 1, 'D3', 'VIP'), ('CIN012', 1, 'D4', 'VIP'), ('CIN012', 1, 'D5', 'VIP'),
-- CIN012, Room 2
('CIN012', 2, 'A1', 'Standard'), ('CIN012', 2, 'A2', 'Standard'), ('CIN012', 2, 'A3', 'Standard'), ('CIN012', 2, 'A4', 'Standard'), ('CIN012', 2, 'A5', 'Standard'),
('CIN012', 2, 'B1', 'VIP'), ('CIN012', 2, 'B2', 'VIP'), ('CIN012', 2, 'B3', 'VIP'), ('CIN012', 2, 'B4', 'VIP'), ('CIN012', 2, 'B5', 'VIP'),
('CIN012', 2, 'C1', 'Standard'), ('CIN012', 2, 'C2', 'Standard'), ('CIN012', 2, 'C3', 'Standard'), ('CIN012', 2, 'C4', 'Standard'), ('CIN012', 2, 'C5', 'Standard'),
('CIN012', 2, 'D1', 'VIP'), ('CIN012', 2, 'D2', 'VIP'), ('CIN012', 2, 'D3', 'VIP'), ('CIN012', 2, 'D4', 'VIP'), ('CIN012', 2, 'D5', 'VIP');

INSERT INTO CUSTOMER (FullName, Email, PhoneNumber, DateOfBirth, MembershipLevel, RegistrationDate, TotalSpent, TotalOrders) VALUES
('Nguyen Van An', 'an.nguyen@gmail.com', '0912345671', '1995-05-10', 'Standard', '2025-04-01 10:00:00', 0.00, 0),
('Tran Thi Bich', 'bich.tran@gmail.com', '0912345672', '1998-07-15', 'VIP', '2025-04-02 12:00:00', 0.00, 0),
('Le Van Cuong', 'cuong.le@gmail.com', '0912345673', '2000-03-20', 'Standard', '2025-04-03 14:00:00', 0.00, 0),
('Pham Thi Dung', 'dung.pham@gmail.com', '0912345674', '1993-11-25', 'Premium', '2025-04-04 09:00:00', 0.00, 0),
('Hoang Van En', 'en.hoang@gmail.com', '0912345675', '1997-09-12', 'Standard', '2025-04-05 11:00:00', 0.00, 0),
('Vo Thi Phuong', 'phuong.vo@gmail.com', '0912345676', '1996-06-30', 'VIP', '2025-04-06 13:00:00', 0.00, 0),
('Bui Van Giang', 'giang.bui@gmail.com', '0912345677', '1999-02-14', 'Standard', '2025-04-07 15:00:00', 0.00, 0),
('Nguyen Thi Hoa', 'hoa.nguyen@gmail.com', '0912345678', '1994-08-22', 'Premium', '2025-04-08 10:00:00', 0.00, 0),
('Tran Van Hung', 'hung.tran@gmail.com', '0912345679', '1992-12-05', 'Standard', '2025-04-09 12:00:00', 0.00, 0),
('Le Thi Kim', 'kim.le@gmail.com', '0912345680', '2001-04-18', 'VIP', '2025-04-10 14:00:00', 0.00, 0),
('Pham Van Long', 'long.pham@gmail.com', '0912345681', '1990-10-10', 'Standard', '2025-04-11 09:00:00', 0.00, 0),
('Hoang Thi Mai', 'mai.hoang@gmail.com', '0912345682', '1998-03-27', 'Premium', '2025-04-12 11:00:00', 0.00, 0),
('Vo Van Nam', 'nam.vo@gmail.com', '0912345683', '1995-01-15', 'Standard', '2025-04-13 13:00:00', 0.00, 0),
('Bui Thi Oanh', 'oanh.bui@gmail.com', '0912345684', '1997-07-09', 'VIP', '2025-04-14 15:00:00', 0.00, 0),
('Nguyen Van Phuc', 'phuc.nguyen@gmail.com', '0912345685', '1993-05-23', 'Standard', '2025-04-15 10:00:00', 0.00, 0),
('Tran Thi Quynh', 'quynh.tran@gmail.com', '0912345686', '1999-09-01', 'Premium', '2025-04-16 12:00:00', 0.00, 0),
('Le Van Son', 'son.le@gmail.com', '0912345687', '1996-11-11', 'Standard', '2025-04-17 14:00:00', 0.00, 0),
('Pham Thi Thao', 'thao.pham@gmail.com', '0912345688', '2000-02-28', 'VIP', '2025-04-18 09:00:00', 0.00, 0),
('Hoang Van Tuan', 'tuan.hoang@gmail.com', '0912345689', '1994-06-17', 'Standard', '2025-04-19 11:00:00', 0.00, 0),
('Vo Thi Uyen', 'uyen.vo@gmail.com', '0912345690', '1998-12-03', 'Premium', '2025-04-20 13:00:00', 0.00, 0),
('Bui Van Vinh', 'vinh.bui@gmail.com', '0912345691', '1992-04-29', 'Standard', '2025-04-21 15:00:00', 0.00, 0),
('Nguyen Thi Xuan', 'xuan.nguyen@gmail.com', '0912345692', '1997-10-08', 'VIP', '2025-04-22 10:00:00', 0.00, 0),
('Tran Van Yen', 'yen.tran@gmail.com', '0912345693', '1995-08-16', 'Standard', '2025-04-23 12:00:00', 0.00, 0),
('Le Thi Zung', 'zung.le@gmail.com', '0912345694', '1999-01-24', 'Premium', '2025-04-24 14:00:00', 0.00, 0);



INSERT INTO MOVIE (Title, ReleaseDate, Duration, Language, Description, PosterURL, AgeRating, Studio, Country, Director, CustomerRating, isShow) VALUES
('Avengers: Endgame', '2019-04-26', 181, 'English', 
 'The final chapter in the Avengers saga, where heroes unite to undo the damage caused by Thanos and restore balance to the universe.', 
 'https://upload.wikimedia.org/wikipedia/vi/thumb/4/42/%C3%81p_ph%C3%ADch_phim_M%E1%BA%AFt_bi%E1%BA%BFc.jpg/330px-%C3%81p_ph%C3%ADch_phim_M%E1%BA%AFt_bi%E1%BA%BFc.jpg', 'PG-13', 'Marvel Studios', 'USA', 'Russo Brothers', 8.50, TRUE),

('Dune: Part Two', '2024-03-01', 166, 'English', 
 'Paul Atreides continues his journey among the Fremen on Arrakis, seeking revenge and fulfilling his destiny amidst war and betrayal.', 
 'https://upload.wikimedia.org/wikipedia/vi/thumb/4/42/%C3%81p_ph%C3%ADch_phim_M%E1%BA%AFt_bi%E1%BA%BFc.jpg/330px-%C3%81p_ph%C3%ADch_phim_M%E1%BA%AFt_bi%E1%BA%BFc.jpg', 'PG-13', 'Warner Bros', 'USA', 'Denis Villeneuve', 9.00, TRUE),

('Spider-Man: No Way Home', '2021-12-17', 148, 'English', 
 'Peter Parker teams up with alternate versions of himself to fight iconic villains who have crossed over from other universes.', 
 'https://upload.wikimedia.org/wikipedia/vi/thumb/4/42/%C3%81p_ph%C3%ADch_phim_M%E1%BA%AFt_bi%E1%BA%BFc.jpg/330px-%C3%81p_ph%C3%ADch_phim_M%E1%BA%AFt_bi%E1%BA%BFc.jpg', 'PG-13', 'Marvel Studios', 'USA', 'Jon Watts', 8.30, TRUE),

('The Batman', '2022-03-04', 176, 'English', 
 'A reimagined Dark Knight investigates a series of cryptic murders that uncover corruption within Gotham City.', 
 'https://upload.wikimedia.org/wikipedia/vi/thumb/4/42/%C3%81p_ph%C3%ADch_phim_M%E1%BA%AFt_bi%E1%BA%BFc.jpg/330px-%C3%81p_ph%C3%ADch_phim_M%E1%BA%AFt_bi%E1%BA%BFc.jpg', 'PG-13', 'Warner Bros', 'USA', 'Matt Reeves', 7.90, TRUE),

('Everything Everywhere All At Once', '2022-03-25', 139, 'English', 
 'An aging Chinese immigrant discovers she must connect with versions of herself from parallel universes to save reality.', 
 'https://upload.wikimedia.org/wikipedia/vi/thumb/4/42/%C3%81p_ph%C3%ADch_phim_M%E1%BA%AFt_bi%E1%BA%BFc.jpg/330px-%C3%81p_ph%C3%ADch_phim_M%E1%BA%AFt_bi%E1%BA%BFc.jpg', 'R', 'A24', 'USA', 'Daniels', 8.00, TRUE),

('Barbie', '2023-07-21', 114, 'English', 
 'Barbie embarks on a journey to the real world, questioning her identity and challenging gender norms in a whimsical adventure.', 
 'https://upload.wikimedia.org/wikipedia/vi/thumb/4/42/%C3%81p_ph%C3%ADch_phim_M%E1%BA%AFt_bi%E1%BA%BFc.jpg/330px-%C3%81p_ph%C3%ADch_phim_M%E1%BA%AFt_bi%E1%BA%BFc.jpg', 'PG-13', 'Warner Bros', 'USA', 'Greta Gerwig', 7.50, FALSE),

('Top Gun: Maverick', '2022-05-27', 131, 'English', 
 'After 30 years of service, Maverick returns to train elite pilots for a dangerous mission that demands the ultimate sacrifice.', 
 'https://upload.wikimedia.org/wikipedia/vi/thumb/4/42/%C3%81p_ph%C3%ADch_phim_M%E1%BA%AFt_bi%E1%BA%BFc.jpg/330px-%C3%81p_ph%C3%ADch_phim_M%E1%BA%AFt_bi%E1%BA%BFc.jpg', 'PG-13', 'Paramount Pictures', 'USA', 'Joseph Kosinski', 8.40, TRUE),

('Poor Things', '2023-12-08', 141, 'English', 
 'A reanimated woman sets off on a surreal journey across continents to claim her independence and explore human experience.', 
 'https://upload.wikimedia.org/wikipedia/vi/thumb/4/42/%C3%81p_ph%C3%ADch_phim_M%E1%BA%AFt_bi%E1%BA%BFc.jpg/330px-%C3%81p_ph%C3%ADch_phim_M%E1%BA%AFt_bi%E1%BA%BFc.jpg', 'R', 'Searchlight Pictures', 'USA', 'Yorgos Lanthimos', 8.10, TRUE),

('Past Lives', '2023-06-02', 106, 'English', 
 'Two childhood friends reconnect after decades, navigating themes of love, destiny, and the paths not taken.', 
 'https://upload.wikimedia.org/wikipedia/vi/thumb/4/42/%C3%81p_ph%C3%ADch_phim_M%E1%BA%AFt_bi%E1%BA%BFc.jpg/330px-%C3%81p_ph%C3%ADch_phim_M%E1%BA%AFt_bi%E1%BA%BFc.jpg', 'PG-13', 'A24', 'USA', 'Celine Song', 7.80, TRUE),

('Mission: Impossible - Dead Reckoning', '2023-07-12', 163, 'English', 
 'Ethan Hunt and his team race against time to track down a deadly weapon before it falls into the wrong hands.', 
 'https://upload.wikimedia.org/wikipedia/vi/thumb/4/42/%C3%81p_ph%C3%ADch_phim_M%E1%BA%AFt_bi%E1%BA%BFc.jpg/330px-%C3%81p_ph%C3%ADch_phim_M%E1%BA%AFt_bi%E1%BA%BFc.jpg', 'PG-13', 'Paramount Pictures', 'USA', 'Christopher McQuarrie', 7.70, FALSE),

('The Zone of Interest', '2023-12-15', 105, 'German', 
 'A Nazi officer and his family live near Auschwitz, oblivious to the horrors happening beyond their garden wall.', 
 'https://upload.wikimedia.org/wikipedia/vi/thumb/4/42/%C3%81p_ph%C3%ADch_phim_M%E1%BA%AFt_bi%E1%BA%BFc.jpg/330px-%C3%81p_ph%C3%ADch_phim_M%E1%BA%AFt_bi%E1%BA%BFc.jpg', 'PG-13', 'A24', 'USA', 'Jonathan Glazer', 7.60, TRUE),

('Anatomy of a Fall', '2023-08-23', 151, 'French', 
 'A woman stands trial for the suspicious death of her husband, unraveling truths and lies in a gripping courtroom drama.', 
 'https://upload.wikimedia.org/wikipedia/vi/thumb/4/42/%C3%81p_ph%C3%ADch_phim_M%E1%BA%AFt_bi%E1%BA%BFc.jpg/330px-%C3%81p_ph%C3%ADch_phim_M%E1%BA%AFt_bi%E1%BA%BFc.jpg', 'R', 'Neon', 'France', 'Justine Triet', 7.90, TRUE),

('Oppenheimer', '2023-07-21', 180, 'English', 
 'A biographical drama exploring the moral and political consequences of J. Robert Oppenheimer’s role in creating the atomic bomb.', 
 'https://upload.wikimedia.org/wikipedia/vi/thumb/4/42/%C3%81p_ph%C3%ADch_phim_M%E1%BA%AFt_bi%E1%BA%BFc.jpg/330px-%C3%81p_ph%C3%ADch_phim_M%E1%BA%AFt_bi%E1%BA%BFc.jpg', 'R', 'Universal Pictures', 'USA', 'Christopher Nolan', 8.60, TRUE),

('Kubo and the Two Strings', '2016-08-19', 101, 'English', 
 'Armed with a magical instrument, Kubo must battle vengeful spirits and uncover the secrets of his family’s past.', 
 'https://upload.wikimedia.org/wikipedia/vi/thumb/4/42/%C3%81p_ph%C3%ADch_phim_M%E1%BA%AFt_bi%E1%BA%BFc.jpg/330px-%C3%81p_ph%C3%ADch_phim_M%E1%BA%AFt_bi%E1%BA%BFc.jpg', 'PG', 'Laika', 'USA', 'Travis Knight', 7.80, FALSE);



INSERT INTO SHOWTIME (CinemaID, RoomNumber, MovieID, StartTime, Duration, Format, Subtitle, Dub) VALUES
('CIN001', 1, 'MOV001', '2025-04-23 14:00:00', 181, '3D', TRUE, FALSE),
('CIN001', 2, 'MOV002', '2025-04-23 16:00:00', 166, 'IMAX', TRUE, FALSE),
('CIN002', 1, 'MOV003', '2025-04-23 18:00:00', 148, '2D', TRUE, FALSE),
('CIN002', 2, 'MOV004', '2025-04-23 20:00:00', 176, '4DX', TRUE, FALSE),
('CIN003', 1, 'MOV005', '2025-04-24 13:00:00', 139, '2D', TRUE, FALSE),
('CIN003', 2, 'MOV007', '2025-04-24 15:00:00', 131, 'IMAX', TRUE, FALSE),
('CIN004', 1, 'MOV008', '2025-04-24 17:00:00', 141, '2D', TRUE, FALSE),
('CIN004', 2, 'MOV009', '2025-04-24 19:00:00', 106, '4DX', TRUE, FALSE),
('CIN005', 1, 'MOV011', '2025-04-25 14:00:00', 105, '2D', TRUE, FALSE),
('CIN005', 2, 'MOV012', '2025-04-25 16:00:00', 151, 'IMAX', TRUE, FALSE),
('CIN006', 1, 'MOV013', '2025-04-25 18:00:00', 180, '2D', TRUE, FALSE),
('CIN006', 2, 'MOV001', '2025-04-25 20:00:00', 181, '4DX', TRUE, FALSE),
('CIN007', 1, 'MOV002', '2025-04-26 13:00:00', 166, '2D', TRUE, FALSE),
('CIN007', 2, 'MOV003', '2025-04-26 15:00:00', 148, 'IMAX', TRUE, FALSE),
('CIN008', 1, 'MOV004', '2025-04-26 17:00:00', 176, '2D', TRUE, FALSE),
('CIN008', 2, 'MOV005', '2025-04-26 19:00:00', 139, '4DX', TRUE, FALSE),
('CIN009', 1, 'MOV007', '2025-04-27 14:00:00', 131, '2D', TRUE, FALSE),
('CIN009', 2, 'MOV008', '2025-04-27 16:00:00', 141, 'IMAX', TRUE, FALSE),
('CIN010', 1, 'MOV009', '2025-04-27 18:00:00', 106, '2D', TRUE, FALSE),
('CIN010', 2, 'MOV011', '2025-04-27 20:00:00', 105, '4DX', TRUE, FALSE),
('CIN011', 1, 'MOV012', '2025-04-28 13:00:00', 151, '2D', TRUE, FALSE),
('CIN011', 2, 'MOV013', '2025-04-28 15:00:00', 180, 'IMAX', TRUE, FALSE),
('CIN012', 1, 'MOV001', '2025-04-28 17:00:00', 181, '2D', TRUE, FALSE),
('CIN012', 2, 'MOV002', '2025-04-28 19:00:00', 166, '4DX', TRUE, FALSE);

INSERT INTO VOUCHER (Code, Description, DiscountAmount, DiscountType, IssueDate, ExpirationDate, MaxUsage, UsedCount, IsActive) VALUES
('SAVE10', '10% off on tickets', 10.00, 'Percentage', '2025-04-01', '2025-12-31', 100, 0, TRUE),
('FREEPOP', 'Free popcorn with ticket', 50000.00, 'Fixed', '2025-04-01', '2025-06-30', 50, 0, TRUE),
('NEWUSER15', '15% off for new users', 15.00, 'Percentage', '2025-04-01', '2025-12-31', 500, 0, TRUE),
('WEEKEND50', '50000 VND off on weekends', 50000.00, 'Fixed', '2025-04-10', '2025-10-31', 100, 0, TRUE),
('FESTIVAL25', '25% off for festival season', 25.00, 'Percentage', '2025-11-01', '2026-01-31', 300, 0, TRUE),
('PREMIUM100', '100000 VND off for Premium members', 100000.00, 'Fixed', '2025-05-01', '2025-11-30', 50, 0, TRUE),
('FIRST20', '20% off for first order', 20.00, 'Percentage', '2025-04-15', '2025-12-31', 400, 0, TRUE),
('MOVIE50', '50000 VND off for movie tickets', 50000.00, 'Fixed', '2025-04-20', '2025-09-30', 200, 0, TRUE),
('SUMMER30', '30% off for summer season', 30.00, 'Percentage', '2025-06-01', '2025-08-31', 600, 0, TRUE),
('VIP150', '150000 VND off for VIP members', 150000.00, 'Fixed', '2025-05-10', '2025-12-31', 100, 0, TRUE),
('FRIENDS10', '10% off for group orders', 10.00, 'Percentage', '2025-04-25', '2025-11-30', 300, 0, TRUE),
('COMBO75', '75000 VND off for combo orders', 75000.00, 'Fixed', '2025-05-01', '2025-10-31', 150, 0, TRUE),
('STUDENT20', '20% off for students', 20.00, 'Percentage', '2025-04-01', '2025-12-31', 200, 0, TRUE),
('FAMILY100', '100000 VND off for family pack', 100000.00, 'Fixed', '2025-04-10', '2025-12-31', 100, 0, TRUE);

INSERT INTO VOUCHER_CONSTRAINT (VoucherID, Type, Above, Below) VALUES
('VCH001', 'MinOrder', 150000.00, 1000000.00),
('VCH002', 'Food', 50000.00, 200000.00),
('VCH003', 'MinOrder', 100000.00, 500000.00),
('VCH004', 'MinOrder', 200000.00, 1000000.00),
('VCH005', 'MinOrder', 250000.00, 2000000.00),
('VCH006', 'MinOrder', 300000.00, 3000000.00),
('VCH007', 'MinOrder', 120000.00, 800000.00),
('VCH008', 'Ticket', 90000.00, 600000.00),
('VCH009', 'MinOrder', 200000.00, 1500000.00),
('VCH010', 'MinOrder', 350000.00, 2500000.00),
('VCH011', 'MinOrder', 110000.00, 700000.00),
('VCH012', 'Food', 100000.00, 500000.00),
('VCH013', 'MinOrder', 130000.00, 900000.00),
('VCH014', 'MinOrder', 400000.00, 3000000.00);

select * from CUSTOMER;

INSERT INTO ORDERS (OrderDate, Status, PaymentMethod, VoucherID, CustomerID) VALUES
('2025-04-23 10:00:00', 'Completed', 'Credit Card', 'VCH001', 'CUS001'),
('2025-04-23 11:00:00', 'Processing', 'Cash', NULL, 'CUS002'),
('2025-04-23 12:00:00', 'Completed', 'Mobile App', 'VCH002', 'CUS003'),
('2025-04-23 13:00:00', 'Completed', 'Credit Card', 'VCH003', 'CUS004'),
('2025-04-24 09:00:00', 'Completed', 'Cash', 'VCH004', 'CUS005'),
('2025-04-24 10:30:00', 'Processing', 'Mobile App', NULL, 'CUS006'),
('2025-04-24 12:00:00', 'Completed', 'Credit Card', 'VCH005', 'CUS007'),
('2025-04-24 14:00:00', 'Completed', 'Cash', 'VCH006', 'CUS008'),
('2025-04-24 16:00:00', 'Processing', 'Mobile App', NULL, 'CUS009'),
('2025-04-24 18:00:00', 'Completed', 'Credit Card', 'VCH007', 'CUS010'),
('2025-04-25 09:00:00', 'Completed', 'Cash', 'VCH008', 'CUS011'),
('2025-04-25 11:00:00', 'Processing', 'Mobile App', NULL, 'CUS012'),
('2025-04-25 13:00:00', 'Completed', 'Credit Card', 'VCH009', 'CUS013'),
('2025-04-25 15:00:00', 'Completed', 'Cash', 'VCH010', 'CUS014'),
('2025-04-25 17:00:00', 'Processing', 'Mobile App', NULL, 'CUS015'),
('2025-04-25 19:00:00', 'Completed', 'Credit Card', 'VCH011', 'CUS016'),
('2025-04-26 09:00:00', 'Completed', 'Cash', 'VCH012', 'CUS017'),
('2025-04-26 11:00:00', 'Processing', 'Mobile App', NULL, 'CUS018'),
('2025-04-26 13:00:00', 'Completed', 'Credit Card', 'VCH013', 'CUS019'),
('2025-04-26 15:00:00', 'Completed', 'Cash', 'VCH014', 'CUS020'),
('2025-04-26 17:00:00', 'Processing', 'Mobile App', NULL, 'CUS021'),
('2025-04-26 19:00:00', 'Completed', 'Credit Card', 'VCH001', 'CUS022'),
('2025-04-27 09:00:00', 'Completed', 'Cash', 'VCH002', 'CUS023'),
('2025-04-27 11:00:00', 'Processing', 'Mobile App', NULL, 'CUS024');

-- INSERT INTO SHOWTIME_SEAT (ShowTimeID, SeatNumber, OrderID, Price) VALUES
-- -- SHT001: CIN001, Room 1, Movie: Avengers: Endgame
-- ('SHT001', 'A1', 'ORD001', 90000.00), ('SHT001', 'A2', 'ORD001', 90000.00),
-- ('SHT001', 'B1', 'ORD001', 120000.00), ('SHT001', 'B2', 'ORD001', 120000.00),
-- -- SHT002: CIN001, Room 2, Movie: Dune: Part Two
-- ('SHT002', 'C1', 'ORD003', 90000.00), ('SHT002', 'C2', 'ORD003', 90000.00),
-- ('SHT002', 'D1', 'ORD003', 120000.00), ('SHT002', 'D2', 'ORD003', 120000.00),
-- -- SHT003: CIN002, Room 1, Movie: Spider-Man: No Way Home
-- ('SHT003', 'A1', 'ORD004', 90000.00), ('SHT003', 'A2', 'ORD004', 90000.00),
-- -- SHT004: CIN002, Room 2, Movie: The Batman
-- ('SHT004', 'B1', 'ORD005', 120000.00), ('SHT004', 'B2', 'ORD005', 120000.00),
-- ('SHT004', 'C1', 'ORD005', 90000.00), ('SHT004', 'C2', 'ORD005', 90000.00),
-- -- SHT005: CIN003, Room 1, Movie: Everything Everywhere
-- ('SHT005', 'A1', 'ORD007', 90000.00), ('SHT005', 'A2', 'ORD007', 90000.00),
-- ('SHT005', 'B1', 'ORD007', 120000.00), ('SHT005', 'B2', 'ORD007', 120000.00),
-- -- SHT006: CIN003, Room 2, Movie: Top Gun: Maverick
-- ('SHT006', 'C1', 'ORD008', 90000.00), ('SHT006', 'C2', 'ORD008', 90000.00),
-- -- SHT007: CIN004, Room 1, Movie: Poor Things
-- ('SHT007', 'A1', 'ORD010', 120000.00), ('SHT007', 'A2', 'ORD010', 120000.00),
-- ('SHT007', 'B1', 'ORD010', 120000.00), ('SHT007', 'B2', 'ORD010', 120000.00),
-- -- SHT008: CIN004, Room 2, Movie: Past Lives
-- ('SHT008', 'C1', 'ORD011', 90000.00), ('SHT008', 'C2', 'ORD011', 90000.00),
-- -- SHT009: CIN005, Room 1, Movie: The Zone of Interest
-- ('SHT009', 'A1', 'ORD012', 90000.00), ('SHT009', 'A2', 'ORD012', 90000.00),
-- ('SHT009', 'B1', 'ORD012', 120000.00), ('SHT009', 'B2', 'ORD012', 120000.00),
-- -- SHT010: CIN005, Room 2, Movie: Anatomy of a Fall
-- ('SHT010', 'C1', 'ORD014', 120000.00), ('SHT010', 'C2', 'ORD014', 120000.00),
-- ('SHT010', 'D1', 'ORD014', 120000.00), ('SHT010', 'D2', 'ORD014', 120000.00),
-- -- SHT011: CIN006, Room 1, Movie: Oppenheimer
-- ('SHT011', 'A1', 'ORD015', 90000.00), ('SHT011', 'A2', 'ORD015', 90000.00),
-- ('SHT011', 'B1', 'ORD015', 120000.00), ('SHT011', 'B2', 'ORD015', 120000.00),
-- -- SHT012: CIN006, Room 2, Movie: Avengers: Endgame
-- ('SHT012', 'C1', 'ORD016', 120000.00), ('SHT012', 'C2', 'ORD016', 120000.00),
-- -- SHT013: CIN007, Room 1, Movie: Dune: Part Two
-- ('SHT013', 'A1', 'ORD017', 90000.00), ('SHT013', 'A2', 'ORD017', 90000.00),
-- -- SHT014: CIN007, Room 2, Movie: Spider-Man: No Way Home
-- ('SHT014', 'B1', 'ORD018', 90000.00), ('SHT014', 'B2', 'ORD018', 90000.00),
-- ('SHT014', 'C1', 'ORD018', 90000.00), ('SHT014', 'C2', 'ORD018', 120000.00),
-- -- SHT015: CIN008, Room 1, Movie: The Batman
-- ('SHT015', 'A1', 'ORD020', 120000.00), ('SHT015', 'A2', 'ORD020', 120000.00),
-- ('SHT015', 'B1', 'ORD020', 120000.00), ('SHT015', 'B2', 'ORD020', 120000.00),
-- -- SHT016: CIN008, Room 2, Movie: Everything Everywhere
-- ('SHT016', 'C1', 'ORD021', 90000.00), ('SHT016', 'C2', 'ORD021', 90000.00),
-- ('SHT016', 'D1', 'ORD021', 120000.00), ('SHT016', 'D2', 'ORD021', 120000.00),
-- -- SHT017: CIN009, Room 1, Movie: Top Gun: Maverick
-- ('SHT017', 'A1', 'ORD022', 120000.00), ('SHT017', 'A2', 'ORD022', 120000.00),
-- -- SHT018: CIN009, Room 2, Movie: Poor Things
-- ('SHT018', 'B1', 'ORD023', 90000.00), ('SHT018', 'B2', 'ORD023', 90000.00),
-- -- SHT019: CIN010, Room 1, Movie: Past Lives
-- ('SHT019', 'A1', 'ORD024', 90000.00), ('SHT019', 'A2', 'ORD024', 90000.00),
-- ('SHT019', 'B1', 'ORD024', 120000.00), ('SHT019', 'B2', 'ORD024', 120000.00),
-- -- SHT020: CIN010, Room 2, Movie: The Zone of Interest
-- ('SHT020', 'C1', 'ORD001', 90000.00), ('SHT020', 'C2', 'ORD001', 90000.00),
-- -- SHT021: CIN011, Room 1, Movie: Anatomy of a Fall
-- ('SHT021', 'A1', 'ORD003', 120000.00), ('SHT021', 'A2', 'ORD003', 120000.00),
-- ('SHT021', 'B1', 'ORD003', 120000.00), ('SHT021', 'B2', 'ORD003', 120000.00),
-- -- SHT022: CIN011, Room 2, Movie: Oppenheimer
-- ('SHT022', 'C1', 'ORD005', 90000.00), ('SHT022', 'C2', 'ORD005', 90000.00),
-- -- SHT023: CIN012, Room 1, Movie: Avengers: Endgame
-- ('SHT023', 'A1', 'ORD007', 90000.00), ('SHT023', 'A2', 'ORD007', 90000.00),
-- ('SHT023', 'B1', 'ORD007', 120000.00), ('SHT023', 'B2', 'ORD007', 120000.00),
-- -- SHT024: CIN012, Room 2, Movie: Dune: Part Two
-- ('SHT024', 'C1', 'ORD008', 120000.00), ('SHT024', 'C2', 'ORD008', 120000.00);

INSERT INTO RATING (CustomerID, MovieID, Score, Comment, RatingDate) VALUES
('CUS001', 'MOV001', 9, 'Epic conclusion!', '2025-04-23 15:00:00'),
('CUS002', 'MOV002', 8, 'Stunning visuals.', '2025-04-23 16:00:00'),
('CUS003', 'MOV003', 9, 'Loved the multiverse!', '2025-04-23 17:00:00'),
('CUS004', 'MOV004', 7, 'Dark and gritty.', '2025-04-23 18:00:00'),
('CUS005', 'MOV005', 8, 'Mind-bending plot.', '2025-04-24 15:00:00'),
('CUS006', 'MOV007', 9, 'Thrilling action.', '2025-04-24 16:00:00'),
('CUS007', 'MOV008', 8, 'Unique and surreal.', '2025-04-24 17:00:00'),
('CUS008', 'MOV009', 7, 'Touching story.', '2025-04-24 18:00:00'),
('CUS009', 'MOV011', 8, 'Chilling and powerful.', '2025-04-25 15:00:00'),
('CUS010', 'MOV012', 9, 'Gripping drama.', '2025-04-25 16:00:00'),
('CUS011', 'MOV013', 8, 'Masterful storytelling.', '2025-04-25 17:00:00'),
('CUS012', 'MOV001', 7, 'Great action.', '2025-04-25 18:00:00'),
('CUS013', 'MOV002', 9, 'Epic sci-fi.', '2025-04-26 15:00:00'),
('CUS014', 'MOV003', 8, 'Fun and exciting.', '2025-04-26 16:00:00'),
('CUS015', 'MOV004', 9, 'Amazing cinematography.', '2025-04-26 17:00:00'),
('CUS016', 'MOV005', 7, 'Creative and fun.', '2025-04-26 18:00:00'),
('CUS017', 'MOV007', 8, 'Best action movie!', '2025-04-27 15:00:00'),
('CUS018', 'MOV008', 9, 'Visually stunning.', '2025-04-27 16:00:00'),
('CUS019', 'MOV009', 8, 'Beautifully crafted.', '2025-04-27 17:00:00'),
('CUS020', 'MOV011', 7, 'Haunting.', '2025-04-27 18:00:00'),
('CUS021', 'MOV012', 9, 'Kept me guessing.', '2025-04-28 15:00:00'),
('CUS022', 'MOV013', 8, 'Powerful and intense.', '2025-04-28 16:00:00'),
('CUS023', 'MOV001', 9, 'Superhero masterpiece.', '2025-04-28 17:00:00'),
('CUS024', 'MOV002', 7, 'Great sequel.', '2025-04-28 18:00:00');

INSERT INTO MOVIE_GENRE (MovieID, Genre) VALUES
('MOV001', 'Action'), ('MOV001', 'Adventure'),
('MOV002', 'Sci-Fi'), ('MOV002', 'Drama'),
('MOV003', 'Action'), ('MOV003', 'Adventure'),
('MOV004', 'Action'), ('MOV004', 'Crime'),
('MOV005', 'Sci-Fi'), ('MOV005', 'Comedy'),
('MOV006', 'Comedy'), ('MOV006', 'Fantasy'),
('MOV007', 'Action'), ('MOV007', 'Drama'),
('MOV008', 'Sci-Fi'), ('MOV008', 'Comedy'),
('MOV009', 'Drama'), ('MOV009', 'Romance'),
('MOV010', 'Action'), ('MOV010', 'Thriller'),
('MOV011', 'Drama'), ('MOV011', 'History'),
('MOV012', 'Drama'), ('MOV012', 'Thriller'),
('MOV013', 'Biography'), ('MOV013', 'Drama'),
('MOV014', 'Animation'), ('MOV014', 'Adventure');

INSERT INTO FOOD_AND_DRINK (Type, Name, StockQuantity, IsAvailable, Price) VALUES
('POPCORN', 'Salted Popcorn', 100, TRUE, 50000.00),
('POPCORN', 'Caramel Popcorn', 80, TRUE, 60000.00),
('DRINK', 'Cola', 200, TRUE, 30000.00),
('DRINK', 'Pepsi', 150, TRUE, 30000.00);

INSERT INTO FOOD_DRINK_ORDER (OrderID, ItemID, Quantity) VALUES
('ORD002', 'FAD001', 2),
('ORD003', 'FAD003', 1),
('ORD007', 'FAD002', 1),
('ORD012', 'FAD004', 2);

INSERT INTO POPCORN (ItemID, Flavor, Size) VALUES
('FAD001', 'Salted', 'Medium'),
('FAD002', 'Caramel', 'Large');

INSERT INTO DRINK (ItemID, Size) VALUES
('FAD003', 'Medium'),
('FAD004', 'Large');





SELECT * FROM SHOWTIME_SEAT;



-- ------------------------------------------------
-- -- Xóa dữ liệu mẫu
DELETE FROM SHOWTIME_SEAT;
DELETE FROM FOOD_DRINK_ORDER;
DELETE FROM ORDERS;
DELETE FROM VOUCHER_CONSTRAINT;
DELETE FROM VOUCHER;
DELETE FROM RATING;
DELETE FROM MOVIE_GENRE;
DELETE FROM SHOWTIME;
DELETE FROM SEAT;
DELETE FROM ROOM;
DELETE FROM CUSTOMER;
DELETE FROM MOVIE;
DELETE FROM SCREEN;
DELETE FROM DRINK;
DELETE FROM POPCORN;
DELETE FROM FOOD_AND_DRINK;
DELETE FROM CINEMA_PHONE;
DELETE FROM CINEMA;
DELETE FROM ID_COUNTER;
-- ----------------------------------------------------- 



SELECT 
        o.OrderID,
        o.OrderDate,
        o.Status,
        o.TotalPrice,
        o.PaymentMethod,
        o.isTicket,
        o.isFood,
        
        s.SeatNumber,
        sh.StartTime,
        sh.EndTime,
        sh.Format,
        
        m.Title AS MovieTitle,
        
        r.RoomNumber,
        r.Type AS RoomType,
        
        c.Name AS CinemaName,
        c.Location AS CinemaLocation

      FROM ORDERS o
      LEFT JOIN SHOWTIME_SEAT s ON o.OrderID = s.OrderID
      LEFT JOIN SHOWTIME sh ON s.ShowTimeID = sh.ShowTimeID
      LEFT JOIN MOVIE m ON sh.MovieID = m.MovieID
      LEFT JOIN ROOM r ON sh.CinemaID = r.CinemaID AND sh.RoomNumber = r.RoomNumber
      LEFT JOIN CINEMA c ON r.CinemaID = c.CinemaID

      WHERE o.CustomerID = 'CUS001'
      ORDER BY o.OrderDate DESC;

SELECT 
        f.ItemID, f.Name, f.Price, f.StockQuantity, f.IsAvailable, 
        p.Flavor, p.Size
      FROM FOOD_AND_DRINK f
      JOIN POPCORN p ON f.ItemID = p.ItemID;

SELECT * FROM FOOD_AND_DRINK WHERE ItemID = 'FAD001';


SELECT 
      S.SeatNumber AS number,
      S.RoomNumber AS room,
      S.CinemaID AS cinema,
      S.SeatType,
      IF(SS.OrderID IS NULL, 'available', 'occupied') AS status,
      
      -- Tính giá dựa trên loại ghế và định dạng suất chiếu
      ROUND(
          CASE 
              WHEN S.SeatType = 'standard' THEN 90000
              WHEN S.SeatType = 'vip' THEN 120000
              ELSE 100000  -- fallback
          END 
          * 
          CASE 
              WHEN ST.Format IN ('4DX', 'IMAX') THEN 1.5
              ELSE 1
          END
      , 0) AS Price

      FROM SEAT S
      JOIN SHOWTIME ST ON S.CinemaID = ST.CinemaID AND S.RoomNumber = ST.RoomNumber
      LEFT JOIN SHOWTIME_SEAT SS 
          ON S.SeatNumber = SS.SeatNumber AND ST.ShowTimeID = SS.ShowTimeID
      WHERE ST.ShowTimeID = 'SHT001';
