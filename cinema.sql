-- Tạo database
CREATE DATABASE IF NOT EXISTS CinemaSystem;
USE CinemaSystem;

-- DROP database cinemasystem;
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
CREATE TABLE CUSTOMER_COUNTER (
    Counter INT NOT NULL
);

-- INSERT INTO CUSTOMER_COUNTER (Counter) VALUES (0);

-- DROP TRIGGER before_customer_insert;
DELIMITER //
CREATE TRIGGER before_customer_insert
BEFORE INSERT ON CUSTOMER
FOR EACH ROW
BEGIN
    DECLARE new_id VARCHAR(6);
    DECLARE next_number INT;

    -- Tăng counter
    UPDATE CUSTOMER_COUNTER SET Counter = Counter + 1;
    SELECT Counter INTO next_number FROM CUSTOMER_COUNTER;

    -- Tạo ID dạng CU0001, CU0002...
    SET new_id = CONCAT('CUS', LPAD(next_number, 3, '0'));
    SET NEW.CustomerID = new_id;
END;
//
DELIMITER ;
-- -----------------------------------------

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

-- TRIGGER
DELIMITER //
CREATE TRIGGER before_showtime_insert
BEFORE INSERT ON SHOWTIME
FOR EACH ROW
BEGIN
    SET NEW.EndTime = DATE_ADD(NEW.StartTime, INTERVAL NEW.Duration MINUTE);
END;
//

CREATE TRIGGER before_showtime_update
BEFORE UPDATE ON SHOWTIME
FOR EACH ROW
BEGIN
    SET NEW.EndTime = DATE_ADD(NEW.StartTime, INTERVAL NEW.Duration MINUTE);
END;
//
DELIMITER ;


DELIMITER //
CREATE TRIGGER after_order_insert
AFTER INSERT ON ORDERS
FOR EACH ROW
BEGIN
    UPDATE CUSTOMER
    SET TotalOrders = TotalOrders + 1,
        TotalSpent = TotalSpent + NEW.TotalPrice
    WHERE CustomerID = NEW.CustomerID;
END;
//
DELIMITER ;

DELIMITER //
CREATE TRIGGER after_order_update
AFTER UPDATE ON ORDERS
FOR EACH ROW
BEGIN
    DECLARE price_diff DECIMAL(10,2);
    SET price_diff = NEW.TotalPrice - OLD.TotalPrice;
    
    UPDATE CUSTOMER
    SET TotalSpent = TotalSpent + price_diff
    WHERE CustomerID = NEW.CustomerID;
END;
//
DELIMITER ;


DELIMITER //
CREATE TRIGGER before_order_insert_voucher
BEFORE INSERT ON ORDERS
FOR EACH ROW
BEGIN
    DECLARE voucher_count INT;
    
    IF NEW.VoucherID IS NOT NULL THEN
        -- Lấy UsedCount và MaxUsage của voucher
        SELECT UsedCount, MaxUsage INTO voucher_count, @max_usage
        FROM VOUCHER
        WHERE VoucherID = NEW.VoucherID;
        
        -- Kiểm tra xem voucher có còn sử dụng được không
        IF voucher_count >= @max_usage THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Voucher has reached maximum usage limit';
        END IF;
        
        -- Cập nhật UsedCount
        UPDATE VOUCHER
        SET UsedCount = UsedCount + 1
        WHERE VoucherID = NEW.VoucherID;
    END IF;
END;
//
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
END;
//

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
END;
//
DELIMITER ;

DELIMITER //
CREATE TRIGGER before_food_drink_order_insert
BEFORE INSERT ON FOOD_DRINK_ORDER
FOR EACH ROW
BEGIN
    DECLARE stock INT;
    
    -- Lấy StockQuantity hiện tại
    SELECT StockQuantity INTO stock
    FROM FOOD_AND_DRINK
    WHERE ItemID = NEW.ItemID;
    
    -- Kiểm tra đủ hàng trong kho
    IF stock < NEW.Quantity THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Insufficient stock for the requested food/drink item';
    END IF;
    
    -- Cập nhật StockQuantity
    UPDATE FOOD_AND_DRINK
    SET StockQuantity = StockQuantity - NEW.Quantity
    WHERE ItemID = NEW.ItemID;
END;
//
DELIMITER ;


DELIMITER //

CREATE TRIGGER after_food_drink_order_insert
AFTER INSERT ON FOOD_DRINK_ORDER
FOR EACH ROW
BEGIN
    DECLARE item_price DECIMAL(10,2);
    DECLARE total_cost DECIMAL(10,2);
    DECLARE customer_id VARCHAR(6);

    -- Lấy giá của món ăn/uống từ bảng FOOD_AND_DRINK
    SELECT Price INTO item_price
    FROM FOOD_AND_DRINK
    WHERE ItemID = NEW.ItemID;

    -- Tính tổng chi phí (Quantity * Price)
    SET total_cost = NEW.Quantity * item_price;

    -- Lấy CustomerID từ bảng ORDERS dựa trên OrderID
    SELECT CustomerID INTO customer_id
    FROM ORDERS
    WHERE OrderID = NEW.OrderID;

    -- Cập nhật TotalSpent trong bảng CUSTOMER
    UPDATE CUSTOMER
    SET TotalSpent = TotalSpent + total_cost
    WHERE CustomerID = customer_id;
END//

DELIMITER ;




-- MANAGER
CREATE TABLE MANAGER (
    Username VARCHAR(255) PRIMARY KEY,
    Password VARCHAR(255) NOT NULL
);
INSERT INTO MANAGER (Username, Password) VALUES
('admin', 'admin123'),
('Haodeptrai', 'Haodeptrai123')







-- INSERT --
SET SQL_SAFE_UPDATES = 0;

INSERT INTO CINEMA (CinemaID, Name, OpeningHours, ClosingHours, Location) VALUES
('CIN001', 'Galaxy Nguyen Hue', '08:00:00', '23:00:00', '123 Nguyen Hue, District 1, HCMC'),
('CIN002', 'CGV Vincom', '09:00:00', '22:30:00', '456 Le Loi, District 3, HCMC'),
('CIN003', 'Lotte Diamond', '08:30:00', '23:30:00', '789 Dien Bien Phu, Binh Thanh, HCMC'),
('CIN004', 'BHD Star', '09:00:00', '22:00:00', '101 Vo Van Tan, District 3, HCMC'),
('CIN005', 'Starlight Cinema', '09:00:00', '23:00:00', '321 Pham Van Dong, Binh Thanh, HCMC'),
('CIN006', 'Mega GS', '08:00:00', '22:00:00', '654 Ba Thang Hai, District 10, HCMC'),
('CIN007', 'Cineplex Nguyen Trai', '10:00:00', '00:00:00', '987 Nguyen Trai, District 5, HCMC'),
('CIN008', 'Royal Cinema', '09:30:00', '23:30:00', '111 Ly Thuong Kiet, District 11, HCMC'),
('CIN009', 'Viva Cinema', '08:30:00', '22:30:00', '222 Tran Phu, District 6, HCMC'),
('CIN010', 'Platinum Cine', '09:00:00', '23:00:00', '333 Nguyen Thi Minh Khai, District 3, HCMC'),
('CIN011', 'Sky Cinema', '10:00:00', '00:30:00', '444 Cach Mang Thang Tam, District 1, HCMC'),
('CIN012', 'Aurora Cinema', '08:00:00', '22:00:00', '555 Le Van Sy, Tan Binh, HCMC'),
('CIN013', 'Golden Cine', '09:00:00', '23:00:00', '666 Truong Chinh, Tan Phu, HCMC'),
('CIN014', 'Diamond Cinema', '09:30:00', '23:30:00', '777 Nguyen Van Linh, District 7, HCMC');

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

INSERT INTO SCREEN (ScreenID, Size, Type, SupportedFormat) VALUES
('SCR001', 'Large', 'IMAX', '2D, 3D, IMAX'),
('SCR002', 'Medium', 'Standard', '2D, 3D'),
('SCR003', 'Small', 'Standard', '2D'),
('SCR004', 'Large', '4DX', '2D, 3D, 4DX'),
('SCR005', 'Medium', 'Standard', '2D, 3D'),
('SCR006', 'Large', 'IMAX', '2D, 3D, IMAX'),
('SCR007', 'Small', 'Standard', '2D'),
('SCR008', 'Large', '4DX', '2D, 3D, 4DX'),
('SCR009', 'Medium', 'Standard', '2D, 3D'),
('SCR010', 'Large', 'IMAX', '2D, 3D, IMAX'),
('SCR011', 'Small', 'Standard', '2D'),
('SCR012', 'Large', '4DX', '2D, 3D, 4DX'),
('SCR013', 'Medium', 'Standard', '2D, 3D'),
('SCR014', 'Large', 'IMAX', '2D, 3D, IMAX');

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
('CIN001', 1, 'A1', 'Standard'), ('CIN001', 1, 'A2', 'Standard'), ('CIN001', 1, 'B1', 'VIP'), ('CIN001', 1, 'B2', 'VIP'),
('CIN001', 2, 'C1', 'Standard'), ('CIN001', 2, 'C2', 'Standard'), ('CIN001', 2, 'D1', 'VIP'), ('CIN001', 2, 'D2', 'VIP'),
('CIN002', 1, 'E1', 'Standard'), ('CIN002', 1, 'E2', 'Standard'), ('CIN002', 1, 'F1', 'VIP'), ('CIN002', 1, 'F2', 'VIP'),
('CIN002', 2, 'G1', 'Standard'), ('CIN002', 2, 'G2', 'Standard'), ('CIN002', 2, 'H1', 'VIP'), ('CIN002', 2, 'H2', 'VIP'),
('CIN003', 1, 'I1', 'Standard'), ('CIN003', 1, 'I2', 'Standard'), ('CIN003', 1, 'J1', 'VIP'), ('CIN003', 1, 'J2', 'VIP'),
('CIN003', 2, 'K1', 'Standard'), ('CIN003', 2, 'K2', 'Standard'), ('CIN003', 2, 'L1', 'VIP'), ('CIN003', 2, 'L2', 'VIP'),
('CIN004', 1, 'M1', 'Standard'), ('CIN004', 1, 'M2', 'Standard'), ('CIN004', 1, 'N1', 'VIP'), ('CIN004', 1, 'N2', 'VIP'),
('CIN004', 2, 'O1', 'Standard'), ('CIN004', 2, 'O2', 'Standard'), ('CIN004', 2, 'P1', 'VIP'), ('CIN004', 2, 'P2', 'VIP'),
('CIN005', 1, 'Q1', 'Standard'), ('CIN005', 1, 'Q2', 'Standard'), ('CIN005', 1, 'R1', 'VIP'), ('CIN005', 1, 'R2', 'VIP'),
('CIN005', 2, 'S1', 'Standard'), ('CIN005', 2, 'S2', 'Standard'), ('CIN005', 2, 'T1', 'VIP'), ('CIN005', 2, 'T2', 'VIP'),
('CIN006', 1, 'U1', 'Standard'), ('CIN006', 1, 'U2', 'Standard'), ('CIN006', 1, 'V1', 'VIP'), ('CIN006', 1, 'V2', 'VIP'),
('CIN006', 2, 'W1', 'Standard'), ('CIN006', 2, 'W2', 'Standard'), ('CIN006', 2, 'X1', 'VIP'), ('CIN006', 2, 'X2', 'VIP');

-- PREFIX INCREMENT
INSERT INTO CUSTOMER_COUNTER (Counter) VALUES (0);

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


INSERT INTO MOVIE (MovieID, Title, ReleaseDate, Duration, Language, Description, PosterURL, AgeRating, Studio, Country, Director, CustomerRating, isShow) VALUES
('MOV001', 'Avengers: Endgame', '2019-04-26', 181, 'English', 'The epic conclusion to the Infinity Saga.', 'https://upload.wikimedia.org/wikipedia/vi/thumb/4/42/%C3%81p_ph%C3%ADch_phim_M%E1%BA%AFt_bi%E1%BA%BFc.jpg/330px-%C3%81p_ph%C3%ADch_phim_M%E1%BA%AFt_bi%E1%BA%BFc.jpg', 'PG-13', 'Marvel Studios', 'USA', 'Russo Brothers', 8.50, TRUE),
('MOV002', 'Dune: Part Two', '2024-03-01', 166, 'English', 'The saga continues on the desert planet.', 'https://poster2.com', 'PG-13', 'Warner Bros', 'USA', 'Denis Villeneuve', 9.00, TRUE),
('MOV003', 'Spider-Man: No Way Home', '2021-12-17', 148, 'English', 'Peter Parker faces multiversal threats.', 'https://poster3.com', 'PG-13', 'Marvel Studios', 'USA', 'Jon Watts', 8.30, TRUE),
('MOV004', 'The Batman', '2022-03-04', 176, 'English', 'A dark take on the caped crusader.', 'https://poster4.com', 'PG-13', 'Warner Bros', 'USA', 'Matt Reeves', 7.90, TRUE),
('MOV005', 'Everything Everywhere All At Once', '2022-03-25', 139, 'English', 'A multiverse-spanning adventure.', 'https://poster5.com', 'R', 'A24', 'USA', 'Daniels', 8.00, TRUE),
('MOV006', 'Barbie', '2023-07-21', 114, 'English', 'A journey from Barbieland to the real world.', 'https://poster6.com', 'PG-13', 'Warner Bros', 'USA', 'Greta Gerwig', 7.50, FALSE),
('MOV007', 'Top Gun: Maverick', '2022-05-27', 131, 'English', 'Maverick trains a new generation of pilots.', 'https://poster7.com', 'PG-13', 'Paramount Pictures', 'USA', 'Joseph Kosinski', 8.40, TRUE),
('MOV008', 'Poor Things', '2023-12-08', 141, 'English', 'A surreal tale of self-discovery.', 'https://poster8.com', 'R', 'Searchlight Pictures', 'USA', 'Yorgos Lanthimos', 8.10, TRUE),
('MOV009', 'Past Lives', '2023-06-02', 106, 'English', 'A story of love and destiny.', 'https://poster9.com', 'PG-13', 'A24', 'USA', 'Celine Song', 7.80, TRUE),
('MOV010', 'Mission: Impossible - Dead Reckoning', '2023-07-12', 163, 'English', 'Ethan Hunt faces a global threat.', 'https://poster10.com', 'PG-13', 'Paramount Pictures', 'USA', 'Christopher McQuarrie', 7.70, FALSE),
('MOV011', 'The Zone of Interest', '2023-12-15', 105, 'German', 'A chilling portrayal of life near Auschwitz.', 'https://poster11.com', 'PG-13', 'A24', 'USA', 'Jonathan Glazer', 7.60, TRUE),
('MOV012', 'Anatomy of a Fall', '2023-08-23', 151, 'French', 'A courtroom drama about truth and perception.', 'https://poster12.com', 'R', 'Neon', 'France', 'Justine Triet', 7.90, TRUE),
('MOV013', 'Oppenheimer', '2023-07-21', 180, 'English', 'The story of the atomic bomb’s creator.', 'https://poster13.com', 'R', 'Universal Pictures', 'USA', 'Christopher Nolan', 8.60, TRUE),
('MOV014', 'Kubo and the Two Strings', '2016-08-19', 101, 'English', 'A young boy embarks on a magical quest.', 'https://poster14.com', 'PG', 'Laika', 'USA', 'Travis Knight', 7.80, FALSE);


INSERT INTO SHOWTIME (ShowTimeID, CinemaID, RoomNumber, MovieID, StartTime, Duration, Format, Subtitle, Dub) VALUES
('SHT001', 'CIN001', 1, 'MOV001', '2025-04-23 14:00:00', 181, '3D', TRUE, FALSE),
('SHT002', 'CIN001', 2, 'MOV002', '2025-04-23 16:00:00', 166, 'IMAX', TRUE, FALSE),
('SHT003', 'CIN002', 1, 'MOV003', '2025-04-23 18:00:00', 148, '2D', TRUE, FALSE),
('SHT004', 'CIN002', 2, 'MOV004', '2025-04-23 20:00:00', 176, '4DX', TRUE, FALSE),
('SHT005', 'CIN003', 1, 'MOV005', '2025-04-24 13:00:00', 139, '2D', TRUE, FALSE),
('SHT006', 'CIN003', 2, 'MOV007', '2025-04-24 15:00:00', 131, 'IMAX', TRUE, FALSE),
('SHT007', 'CIN004', 1, 'MOV008', '2025-04-24 17:00:00', 141, '2D', TRUE, FALSE),
('SHT008', 'CIN004', 2, 'MOV009', '2025-04-24 19:00:00', 106, '4DX', TRUE, FALSE),
('SHT009', 'CIN005', 1, 'MOV011', '2025-04-25 14:00:00', 105, '2D', TRUE, FALSE),
('SHT010', 'CIN005', 2, 'MOV012', '2025-04-25 16:00:00', 151, 'IMAX', TRUE, FALSE),
('SHT011', 'CIN006', 1, 'MOV013', '2025-04-25 18:00:00', 180, '2D', TRUE, FALSE),
('SHT012', 'CIN006', 2, 'MOV001', '2025-04-25 20:00:00', 181, '4DX', TRUE, FALSE),
('SHT013', 'CIN007', 1, 'MOV002', '2025-04-26 13:00:00', 166, '2D', TRUE, FALSE),
('SHT014', 'CIN007', 2, 'MOV003', '2025-04-26 15:00:00', 148, 'IMAX', TRUE, FALSE),
('SHT015', 'CIN008', 1, 'MOV004', '2025-04-26 17:00:00', 176, '2D', TRUE, FALSE),
('SHT016', 'CIN008', 2, 'MOV005', '2025-04-26 19:00:00', 139, '4DX', TRUE, FALSE),
('SHT017', 'CIN009', 1, 'MOV007', '2025-04-27 14:00:00', 131, '2D', TRUE, FALSE),
('SHT018', 'CIN009', 2, 'MOV008', '2025-04-27 16:00:00', 141, 'IMAX', TRUE, FALSE),
('SHT019', 'CIN010', 1, 'MOV009', '2025-04-27 18:00:00', 106, '2D', TRUE, FALSE),
('SHT020', 'CIN010', 2, 'MOV011', '2025-04-27 20:00:00', 105, '4DX', TRUE, FALSE),
('SHT021', 'CIN011', 1, 'MOV012', '2025-04-28 13:00:00', 151, '2D', TRUE, FALSE),
('SHT022', 'CIN011', 2, 'MOV013', '2025-04-28 15:00:00', 180, 'IMAX', TRUE, FALSE),
('SHT023', 'CIN012', 1, 'MOV001', '2025-04-28 17:00:00', 181, '2D', TRUE, FALSE),
('SHT024', 'CIN012', 2, 'MOV002', '2025-04-28 19:00:00', 166, '4DX', TRUE, FALSE);

INSERT INTO VOUCHER (VoucherID, Code, Description, DiscountAmount, DiscountType, IssueDate, ExpirationDate, MaxUsage, UsedCount, IsActive) VALUES
('VCH001', 'SAVE10', '10% off on tickets', 10.00, 'Percentage', '2025-04-01', '2025-12-31', 100, 0, TRUE),
('VCH002', 'FREEPOP', 'Free popcorn with ticket', 50000.00, 'Fixed', '2025-04-01', '2025-06-30', 50, 0, TRUE),
('VCH003', 'NEWUSER15', '15% off for new users', 15.00, 'Percentage', '2025-04-01', '2025-12-31', 500, 0, TRUE),
('VCH004', 'WEEKEND50', '50000 VND off on weekends', 50000.00, 'Fixed', '2025-04-10', '2025-10-31', 100, 0, TRUE),
('VCH005', 'FESTIVAL25', '25% off for festival season', 25.00, 'Percentage', '2025-11-01', '2026-01-31', 300, 0, TRUE),
('VCH006', 'PREMIUM100', '100000 VND off for Premium members', 100000.00, 'Fixed', '2025-05-01', '2025-11-30', 50, 0, TRUE),
('VCH007', 'FIRST20', '20% off for first order', 20.00, 'Percentage', '2025-04-15', '2025-12-31', 400, 0, TRUE),
('VCH008', 'MOVIE50', '50000 VND off for movie tickets', 50000.00, 'Fixed', '2025-04-20', '2025-09-30', 200, 0, TRUE),
('VCH009', 'SUMMER30', '30% off for summer season', 30.00, 'Percentage', '2025-06-01', '2025-08-31', 600, 0, TRUE),
('VCH010', 'VIP150', '150000 VND off for VIP members', 150000.00, 'Fixed', '2025-05-10', '2025-12-31', 100, 0, TRUE),
('VCH011', 'FRIENDS10', '10% off for group orders', 10.00, 'Percentage', '2025-04-25', '2025-11-30', 300, 0, TRUE),
('VCH012', 'COMBO75', '75000 VND off for combo orders', 75000.00, 'Fixed', '2025-05-01', '2025-10-31', 150, 0, TRUE),
('VCH013', 'STUDENT20', '20% off for students', 20.00, 'Percentage', '2025-04-01', '2025-12-31', 200, 0, TRUE),
('VCH014', 'FAMILY100', '100000 VND off for family pack', 100000.00, 'Fixed', '2025-04-10', '2025-12-31', 100, 0, TRUE);

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

INSERT INTO ORDERS (OrderID, OrderDate, Status, PaymentMethod, TotalPrice, VoucherID, CustomerID, isTicket, isFood) VALUES
('ORD001', '2025-04-23 10:00:00', 'Completed', 'Credit Card', 180000.00, 'VCH001', 'CUS001', TRUE, FALSE),
('ORD002', '2025-04-23 11:00:00', 'Processing', 'Cash', 110000.00, NULL, 'CUS002', FALSE, TRUE),
('ORD003', '2025-04-23 12:00:00', 'Completed', 'Mobile App', 250000.00, 'VCH002', 'CUS003', TRUE, TRUE),
('ORD004', '2025-04-23 13:00:00', 'Completed', 'Credit Card', 90000.00, 'VCH003', 'CUS004', TRUE, FALSE),
('ORD005', '2025-04-24 09:00:00', 'Completed', 'Cash', 200000.00, 'VCH004', 'CUS005', TRUE, FALSE),
('ORD006', '2025-04-24 10:30:00', 'Processing', 'Mobile App', 150000.00, NULL, 'CUS006', FALSE, TRUE),
('ORD007', '2025-04-24 12:00:00', 'Completed', 'Credit Card', 300000.00, 'VCH005', 'CUS007', TRUE, TRUE),
('ORD008', '2025-04-24 14:00:00', 'Completed', 'Cash', 120000.00, 'VCH006', 'CUS008', TRUE, FALSE),
('ORD009', '2025-04-24 16:00:00', 'Processing', 'Mobile App', 180000.00, NULL, 'CUS009', FALSE, TRUE),
('ORD010', '2025-04-24 18:00:00', 'Completed', 'Credit Card', 220000.00, 'VCH007', 'CUS010', TRUE, FALSE),
('ORD011', '2025-04-25 09:00:00', 'Completed', 'Cash', 130000.00, 'VCH008', 'CUS011', TRUE, FALSE),
('ORD012', '2025-04-25 11:00:00', 'Processing', 'Mobile App', 280000.00, NULL, 'CUS012', TRUE, TRUE),
('ORD013', '2025-04-25 13:00:00', 'Completed', 'Credit Card', 100000.00, 'VCH009', 'CUS013', FALSE, TRUE),
('ORD014', '2025-04-25 15:00:00', 'Completed', 'Cash', 350000.00, 'VCH010', 'CUS014', TRUE, FALSE),
('ORD015', '2025-04-25 17:00:00', 'Processing', 'Mobile App', 140000.00, NULL, 'CUS015', TRUE, TRUE),
('ORD016', '2025-04-25 19:00:00', 'Completed', 'Credit Card', 240000.00, 'VCH011', 'CUS016', TRUE, FALSE),
('ORD017', '2025-04-26 09:00:00', 'Completed', 'Cash', 160000.00, 'VCH012', 'CUS017', TRUE, FALSE),
('ORD018', '2025-04-26 11:00:00', 'Processing', 'Mobile App', 320000.00, NULL, 'CUS018', TRUE, TRUE),
('ORD019', '2025-04-26 13:00:00', 'Completed', 'Credit Card', 110000.00, 'VCH013', 'CUS019', FALSE, TRUE),
('ORD020', '2025-04-26 15:00:00', 'Completed', 'Cash', 380000.00, 'VCH014', 'CUS020', TRUE, FALSE),
('ORD021', '2025-04-26 17:00:00', 'Processing', 'Mobile App', 150000.00, NULL, 'CUS021', TRUE, TRUE),
('ORD022', '2025-04-26 19:00:00', 'Completed', 'Credit Card', 260000.00, 'VCH001', 'CUS022', TRUE, FALSE),
('ORD023', '2025-04-27 09:00:00', 'Completed', 'Cash', 170000.00, 'VCH002', 'CUS023', TRUE, FALSE),
('ORD024', '2025-04-27 11:00:00', 'Processing', 'Mobile App', 340000.00, NULL, 'CUS024', TRUE, TRUE);

INSERT INTO SHOWTIME_SEAT (ShowTimeID, SeatNumber, OrderID, Price) VALUES
('SHT001', 'A1', 'ORD001', 90000.00), ('SHT001', 'A2', 'ORD001', 90000.00),
('SHT002', 'C1', 'ORD003', 90000.00), ('SHT002', 'C2', 'ORD003', 90000.00),
('SHT003', 'E1', 'ORD004', 90000.00),
('SHT004', 'G1', 'ORD005', 120000.00), ('SHT004', 'G2', 'ORD005', 120000.00),
('SHT005', 'I1', 'ORD007', 90000.00), ('SHT005', 'I2', 'ORD007', 90000.00),
('SHT006', 'K1', 'ORD008', 90000.00),
('SHT007', 'M1', 'ORD010', 120000.00), ('SHT007', 'M2', 'ORD010', 120000.00),
('SHT008', 'O1', 'ORD011', 90000.00),
('SHT009', 'Q1', 'ORD012', 90000.00), ('SHT009', 'Q2', 'ORD012', 90000.00),
('SHT010', 'S1', 'ORD014', 120000.00), ('SHT010', 'S2', 'ORD014', 120000.00),
('SHT011', 'U1', 'ORD015', 90000.00), ('SHT011', 'U2', 'ORD015', 90000.00),
('SHT012', 'W1', 'ORD016', 120000.00),
('SHT013', 'A1', 'ORD017', 90000.00),
('SHT014', 'C1', 'ORD018', 90000.00), ('SHT014', 'C2', 'ORD018', 90000.00),
('SHT015', 'E1', 'ORD020', 120000.00), ('SHT015', 'E2', 'ORD020', 120000.00),
('SHT016', 'G1', 'ORD021', 90000.00), ('SHT016', 'G2', 'ORD021', 90000.00),
('SHT017', 'I1', 'ORD022', 120000.00),
('SHT018', 'K1', 'ORD023', 90000.00),
('SHT019', 'M1', 'ORD024', 90000.00), ('SHT019', 'M2', 'ORD024', 90000.00),
('SHT020', 'O1', 'ORD001', 90000.00),
('SHT021', 'Q1', 'ORD003', 120000.00), ('SHT021', 'Q2', 'ORD003', 120000.00),
('SHT022', 'S1', 'ORD005', 90000.00),
('SHT023', 'U1', 'ORD007', 90000.00), ('SHT023', 'U2', 'ORD007', 90000.00),
('SHT024', 'W1', 'ORD008', 120000.00),
('SHT001', 'B1', 'ORD010', 120000.00),
('SHT002', 'D1', 'ORD011', 90000.00),
('SHT003', 'F1', 'ORD012', 120000.00),
('SHT004', 'H1', 'ORD014', 90000.00),
('SHT005', 'J1', 'ORD015', 120000.00),
('SHT006', 'L1', 'ORD016', 90000.00),
('SHT007', 'N1', 'ORD017', 120000.00);

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

INSERT INTO FOOD_AND_DRINK (ItemID, Type, Name, StockQuantity, IsAvailable, Price) VALUES
('FAD001', 'POPCORN', 'Salted Popcorn', 100, TRUE, 50000.00),
('FAD002', 'POPCORN', 'Caramel Popcorn', 80, TRUE, 60000.00),
('FAD003', 'DRINK', 'Cola', 200, TRUE, 30000.00),
('FAD004', 'DRINK', 'Pepsi', 150, TRUE, 30000.00);

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
DELETE FROM CUSTOMER_COUNTer;
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


