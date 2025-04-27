-- -- Tạo user sManager
-- CREATE USER 'sManager'@'localhost' IDENTIFIED BY '123456';
-- GRANT ALL PRIVILEGES ON *.* TO 'sManager'@'localhost' WITH GRANT OPTION;
-- FLUSH PRIVILEGES;

-- drop database cinemasystem;

-- Tạo database
CREATE DATABASE IF NOT EXISTS cinemasystem;
USE cinemasystem;



-- CREATE
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
    ON DELETE CASCADE
    ON UPDATE CASCADE
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
    ScreenID CHAR(6),
    PRIMARY KEY (CinemaID, RoomNumber),
    FOREIGN KEY (CinemaID) REFERENCES CINEMA(CinemaID)
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (ScreenID) REFERENCES SCREEN(ScreenID)
    ON DELETE SET NULL ON UPDATE CASCADE
);


CREATE TABLE SEAT (
    CinemaID CHAR(6) NOT NULL,
    RoomNumber INT NOT NULL,
    SeatNumber CHAR(3) NOT NULL,
    SeatType VARCHAR(50) NOT NULL,
    PRIMARY KEY (CinemaID, RoomNumber, SeatNumber),
    FOREIGN KEY (CinemaID, RoomNumber) REFERENCES ROOM(CinemaID, RoomNumber)
    ON DELETE CASCADE ON UPDATE CASCADE
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
    FOREIGN KEY (CinemaID, RoomNumber) REFERENCES ROOM(CinemaID, RoomNumber)
    ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (MovieID) REFERENCES MOVIE(MovieID)
    ON DELETE CASCADE ON UPDATE CASCADE,
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
    FOREIGN KEY (CustomerID) REFERENCES CUSTOMER(CustomerID)
    ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (VoucherID) REFERENCES VOUCHER(VoucherID)
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE SHOWTIME_SEAT (
	ShowTimeID CHAR(6) NOT NULL,
    CinemaID CHAR(6) NOT NULL,
    RoomNumber INT NOT NULL,
    SeatNumber CHAR(3) NOT NULL,
    OrderID CHAR(6),
    Price DECIMAL(10,2) NOT NULL CHECK (Price >= 0),
    PRIMARY KEY (ShowTimeID, SeatNumber),
    FOREIGN KEY (ShowTimeID) REFERENCES SHOWTIME(ShowTimeID)
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (OrderID) REFERENCES ORDERS(OrderID)
    ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (CinemaID, RoomNumber, SeatNumber) REFERENCES SEAT(CinemaID, RoomNumber, SeatNumber)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE RATING (
    CustomerID CHAR(6) NOT NULL,
    MovieID CHAR(6) NOT NULL,
    Score INT NOT NULL CHECK (Score BETWEEN 1 AND 10),
    Comment TEXT,
	RatingDate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (CustomerID, MovieID),
    FOREIGN KEY (CustomerID) REFERENCES CUSTOMER(CustomerID)
    ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (MovieID) REFERENCES MOVIE(MovieID)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE MOVIE_GENRE (
    MovieID CHAR(6) NOT NULL,
    Genre VARCHAR(50),
    PRIMARY KEY (MovieID, Genre),
    FOREIGN KEY (MovieID) REFERENCES MOVIE(MovieID)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE VOUCHER_CONSTRAINT (
    VoucherID CHAR(6) NOT NULL,
    Type ENUM("TotalOrderPrice", "MaxValue", "TotalSpent"),
    Above FLOAT,
    Below FLOAT,
    PRIMARY KEY (VoucherID, Type),
    FOREIGN KEY (VoucherID) REFERENCES VOUCHER(VoucherID)
    ON DELETE CASCADE ON UPDATE CASCADE
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
    FOREIGN KEY (OrderID) REFERENCES ORDERS(OrderID)
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (ItemID) REFERENCES FOOD_AND_DRINK(ItemID)
    ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE POPCORN (
    ItemID CHAR(6) PRIMARY KEY,
    Flavor VARCHAR(100),
    Size ENUM('Small', 'Medium', 'Large'),
    FOREIGN KEY (ItemID) REFERENCES FOOD_AND_DRINK(ItemID)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE DRINK (
    ItemID CHAR(6) PRIMARY KEY,
    Size ENUM('Small', 'Medium', 'Large'),
    FOREIGN KEY (ItemID) REFERENCES FOOD_AND_DRINK(ItemID)
    ON DELETE CASCADE ON UPDATE CASCADE
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
    INSERT INTO SHOWTIME_SEAT (ShowTimeID, CinemaID, RoomNumber, SeatNumber, OrderID, Price)
    SELECT
        NEW.ShowTimeID,
        S.CinemaID,
        S.RoomNumber,
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

DELIMITER //
-- Trigger áp dụng voucher cho đơn hàng
CREATE TRIGGER after_order_booked
BEFORE UPDATE ON ORDERS
FOR EACH ROW
BEGIN
-- Biến chính
    DECLARE discount_amount DECIMAL(10,2);
    DECLARE discount_type   VARCHAR(20);
    DECLARE total_price     DECIMAL(10,2);
    DECLARE customer_spent   DECIMAL(10,2);
    DECLARE valid            BOOLEAN DEFAULT TRUE;
    DECLARE max_discount     DECIMAL(10,2) DEFAULT NULL;

    -- Biến cho cursor
    DECLARE cType   VARCHAR(20);
    DECLARE cBelow  DECIMAL(10,2);
    DECLARE cAbove  DECIMAL(10,2);
    DECLARE done    INT DEFAULT 0;

    -- Cursor lấy tất cả constraint
    DECLARE cur_constraints CURSOR FOR
      SELECT `Type`, `Below`, `Above`
      FROM VOUCHER_CONSTRAINT
      WHERE VoucherID = NEW.VoucherID;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

  -- Chỉ chạy khi đổi từ Processing sang Booked và có VoucherID
  IF OLD.Status = 'Processing'
     AND NEW.Status = 'Booked'
     AND NEW.VoucherID IS NOT NULL THEN

    -- 1. Lấy thông tin voucher và kiểm tra active/expiry
    SELECT v.DiscountAmount, v.DiscountType
    INTO discount_amount, discount_type
    FROM VOUCHER v
    WHERE v.VoucherID = NEW.VoucherID
      AND v.IsActive = TRUE
      AND v.ExpirationDate >= CURRENT_DATE();
    IF discount_amount IS NULL THEN
      SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Voucher không tồn tại hoặc hết hạn.';
    END IF;

    -- 2. Lấy tổng chi tiêu của khách (cho TotalSpent)
    SELECT TotalSpent
    INTO customer_spent
    FROM CUSTOMER
    WHERE CustomerID = NEW.CustomerID;

    -- 3. Duyệt từng constraint
    OPEN cur_constraints;
    constraint_loop: LOOP
      FETCH cur_constraints INTO cType, cBelow, cAbove;
      IF done = 1 THEN
        LEAVE constraint_loop;
      END IF;

      IF cType = 'TotalOrderPrice' THEN
        IF NOT ((cBelow IS NULL OR NEW.TotalPrice > cBelow)
             AND (cAbove IS NULL OR NEW.TotalPrice < cAbove)) THEN
          SET valid = FALSE;
          LEAVE constraint_loop;
        END IF;

      ELSEIF cType = 'TotalSpent' THEN
        IF NOT (cBelow IS NULL OR customer_spent > cBelow) THEN
          SET valid = FALSE;
          LEAVE constraint_loop;
        END IF;

      ELSEIF cType = 'MaxValue' THEN
        -- Giữ giá trị nhỏ nhất
        IF max_discount IS NULL OR cAbove < max_discount THEN
          SET max_discount = cAbove;
        END IF;
      END IF;
    END LOOP;
    CLOSE cur_constraints;

    -- 4. Nếu không hợp lệ, abort
    IF NOT valid THEN
      SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Không thoả điều kiện sử dụng voucher.';
    END IF;

    -- 5. Tính discount_amount theo type
    IF discount_type = 'Percentage' THEN
      SET discount_amount = NEW.TotalPrice * discount_amount / 100;
    END IF;

    -- 6. Áp giới hạn MaxValue
    IF max_discount IS NOT NULL THEN
      SET discount_amount = LEAST(discount_amount, max_discount);
    END IF;

    -- 7. Cập nhật TotalPrice (không âm)
    SET NEW.TotalPrice = GREATEST(0, NEW.TotalPrice - discount_amount);
  END IF;
END;
//

DELIMITER ;



-- Procedure
DELIMITER //

CREATE PROCEDURE InsertFoodAndDrink(
    IN p_type ENUM('POPCORN', 'DRINK', 'OTHERS'),
    IN p_name VARCHAR(50),
    IN p_stock_quantity INT,
    IN p_is_available BOOLEAN,
    IN p_price DECIMAL(10,2),
    IN p_flavor VARCHAR(100),
    IN p_size ENUM('Small', 'Medium', 'Large'),
    OUT p_item_id CHAR(6)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Lỗi khi thêm mặt hàng. Vui lòng kiểm tra dữ liệu đầu vào.';
    END;

    IF p_type IS NULL OR p_name IS NULL OR p_stock_quantity < 0 OR p_price < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Dữ liệu đầu vào không hợp lệ.';
    END IF;

    IF p_type = 'POPCORN' AND p_flavor IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Hương vị là bắt buộc đối với bắp rang.';
    END IF;

    IF (p_type = 'POPCORN' OR p_type = 'DRINK') AND p_size IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Kích thước là bắt buộc đối với bắp rang hoặc đồ uống.';
    END IF;

    START TRANSACTION;

    INSERT INTO FOOD_AND_DRINK (Type, Name, StockQuantity, IsAvailable, Price)
    VALUES (p_type, p_name, p_stock_quantity, p_is_available, p_price);

    SELECT ItemID INTO p_item_id
    FROM FOOD_AND_DRINK    WHERE ItemID = (SELECT CONCAT('FAD', LPAD(Counter, 3, '0')) 
    FROM ID_COUNTER WHERE Prefix = 'FAD');

    IF p_type = 'POPCORN' THEN
        INSERT INTO POPCORN (ItemID, Flavor, Size)
        VALUES (p_item_id, p_flavor, p_size);
    ELSEIF p_type = 'DRINK' THEN
        INSERT INTO DRINK (ItemID, Size)
        VALUES (p_item_id, p_size);
    END IF;

    COMMIT;
END //

CREATE PROCEDURE GetCinemaStatistics(
  OUT p_TotalRevenue DECIMAL(12,2),
  OUT p_TotalTickets INT,
  OUT p_TotalMovies INT
)
BEGIN
  -- Tổng doanh thu
  SELECT COALESCE(SUM(TotalPrice), 0)
  INTO p_TotalRevenue
  FROM ORDERS;

  -- Tổng số vé bán
  SELECT COUNT(*)
  INTO p_TotalTickets
  FROM SHOWTIME_SEAT
  WHERE OrderID IS NOT NULL;

  -- Tổng số phim đang chiếu (có showtime trong tương lai hoặc isShow = true)
  SELECT COUNT(DISTINCT m.MovieID)
  INTO p_TotalMovies
  FROM MOVIE m
  JOIN SHOWTIME s ON m.MovieID = s.MovieID
  WHERE s.StartTime >= CURRENT_DATE
     OR m.isShow = TRUE;
END;
//

-- Doanh thu theo tháng
CREATE PROCEDURE RevenueByMonth()
BEGIN
  SELECT DATE_FORMAT(OrderDate, '%Y-%m') AS Month, SUM(TotalPrice) AS MonthlyRevenue
  FROM ORDERS
  GROUP BY Month
  ORDER BY Month;
END;//

-- Doanh thu theo ngày
CREATE PROCEDURE RevenueByDay()
BEGIN
  SELECT DATE(OrderDate) AS Date, SUM(TotalPrice) AS DailyRevenue
  FROM ORDERS
  GROUP BY Date
  ORDER BY Date;
END;//

-- Doanh thu theo phim
CREATE PROCEDURE RevenueByMovie()
BEGIN
  SELECT m.Title, SUM(s.Price) AS MovieRevenue
  FROM SHOWTIME_SEAT s 
  JOIN SHOWTIME st ON s.ShowTimeID = st.ShowTimeID
  JOIN MOVIE m ON st.MovieID = m.MovieID
  WHERE s.OrderID IS NOT NULL
  GROUP BY m.Title
  ORDER BY MovieRevenue DESC;
END;//

-- Top khách hàng chi tiêu nhiều nhất
CREATE PROCEDURE TopCustomers(IN limit_count INT)
BEGIN
  SELECT CustomerID, FullName, TotalSpent, TotalOrders
  FROM CUSTOMER
  ORDER BY TotalSpent DESC
  LIMIT limit_count;
END;//

DELIMITER ;

DELIMITER //


-- Add Features
CREATE PROCEDURE GetHighRatedMovies(
    IN p_MinRating DECIMAL(4,2)
)
BEGIN
    -- Kiểm tra đầu vào
    IF p_MinRating < 0 OR p_MinRating > 10 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Điểm đánh giá tối thiểu phải nằm trong khoảng từ 0 đến 10.';
    END IF;
    
    -- Truy vấn các phim có đánh giá trung bình trên ngưỡng
    SELECT 
        m.MovieID,
        m.Title,
        AVG(r.Score) AS AverageRating,
        COUNT(r.Score) AS NumberOfRatings
    FROM MOVIE m
    LEFT JOIN RATING r ON m.MovieID = r.MovieID
    WHERE m.isShow = TRUE
    GROUP BY m.MovieID, m.Title
    HAVING AVG(r.Score) > p_MinRating
    ORDER BY AverageRating DESC;
END //

DELIMITER ;

DELIMITER //

CREATE TRIGGER after_showtime_delete
AFTER DELETE ON SHOWTIME
FOR EACH ROW
BEGIN
    DECLARE remaining_showtimes INT;
    
    -- Đếm số suất chiếu còn lại của phim
    SELECT COUNT(*) INTO remaining_showtimes
    FROM SHOWTIME
    WHERE MovieID = OLD.MovieID;
    
    -- Nếu không còn suất chiếu, cập nhật isShow = FALSE
    IF remaining_showtimes = 0 THEN
        UPDATE MOVIE
        SET isShow = FALSE
        WHERE MovieID = OLD.MovieID;
    END IF;
END //

DELIMITER ;

DELIMITER //

CREATE FUNCTION GetRevenueByLocation(location_id CHAR(6)) 
RETURNS DECIMAL(10,2)
DETERMINISTIC
READS SQL DATA
BEGIN
  DECLARE total_revenue DECIMAL(10,2);
  
  SELECT SUM(o.TotalPrice) INTO total_revenue
  FROM ORDERS o
  JOIN SHOWTIME_SEAT ss ON o.OrderID = ss.OrderID
  JOIN SHOWTIME st ON ss.ShowTimeID = st.ShowTimeID
  WHERE st.CinemaID = location_id AND o.Status = 'Completed';
  
  RETURN IFNULL(total_revenue, 0);
END//

DELIMITER ;

DELIMITER //

CREATE FUNCTION GetShowtimeOccupancyRate(showtime_id CHAR(6)) 
RETURNS DECIMAL(5,2)
DETERMINISTIC
READS SQL DATA
BEGIN
  DECLARE sold_seats INT;
  DECLARE total_seats INT;
  DECLARE occupancy_rate DECIMAL(5,2);
  
  -- Get total seats for the room
  SELECT COUNT(*) INTO total_seats
  FROM SHOWTIME_SEAT
  WHERE ShowTimeID = showtime_id;
  
  -- Get sold seats
  SELECT COUNT(*) INTO sold_seats
  FROM SHOWTIME_SEAT
  WHERE ShowTimeID = showtime_id AND OrderID IS NOT NULL;
  
  -- Calculate occupancy rate (percentage)
  IF total_seats > 0 THEN
    SET occupancy_rate = (sold_seats / total_seats) * 100;
  ELSE
    SET occupancy_rate = 0;
  END IF;
  
  RETURN occupancy_rate;
END//

DELIMITER ;

DELIMITER //
CREATE FUNCTION GetMovieOrderCount(movie_id CHAR(6)) 
RETURNS INT
DETERMINISTIC
READS SQL DATA
BEGIN
  DECLARE order_count INT;
  
  SELECT COUNT(DISTINCT ss.OrderID) INTO order_count
  FROM SHOWTIME_SEAT ss
  JOIN SHOWTIME st ON ss.ShowTimeID = st.ShowTimeID
  WHERE st.MovieID = movie_id
    AND ss.OrderID IS NOT NULL;
  
  RETURN order_count;
END//
DELIMITER ;

-- SELECT GetMovieOrderCount('MOV001');
-- SELECT GetShowtimeOccupancyRate('SHT001');
-- SELECT GetRevenueByLocation('CIN001');

-- INSERT --
SET SQL_SAFE_UPDATES = 0;

INSERT INTO MANAGER (Username, Password) VALUES
('admin', 'admin123'),
('Hieudeptrai','Hieudeptrai123'),
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

-- Insert into VOUCHER
INSERT INTO VOUCHER (Code, Description, DiscountAmount, DiscountType, IssueDate, ExpirationDate, MaxUsage, UsedCount, IsActive)
VALUES
('DISCOUNT10', '10% off on orders over 500,000 VND', 10, 'Percentage', '2025-04-01', '2025-12-31', 100, 0, TRUE),
('FIXED50', '50,000 VND off on any order', 50000, 'Fixed', '2025-04-01', '2025-12-31', 50, 0, TRUE),
('LOYALTY20', '20% off for loyal customers who have spent over 1,000,000 VND', 20, 'Percentage', '2025-04-01', '2025-12-31', 200, 0, TRUE),
('SPECIAL15', '15% off for orders between 300,000 and 1,000,000 VND, max discount 150,000 VND', 15, 'Percentage', '2025-04-01', '2025-12-31', 150, 0, TRUE);

-- Insert into VOUCHER_CONSTRAINT
INSERT INTO VOUCHER_CONSTRAINT (VoucherID, Type, Above, Below)
VALUES
('VCH001', 'TotalOrderPrice', NULL, 500000),
('VCH001', 'MaxValue', 100000, NULL),
('VCH002', 'TotalOrderPrice', NULL, 0),
('VCH003', 'TotalSpent', NULL, 1000000),
('VCH003', 'TotalOrderPrice', NULL, 200000),
('VCH004', 'TotalOrderPrice', 1000000, 300000),
('VCH004', 'MaxValue', 150000, NULL);


INSERT INTO ORDERS (OrderDate, Status, PaymentMethod, TotalPrice, VoucherID, CustomerID, isTicket) VALUES
('2025-04-23 10:00:00', 'Completed', 'Credit Card', 180000.00, 'VCH001', 'CUS001', TRUE),
('2025-04-23 11:00:00', 'Processing', 'Cash', 90000.00, NULL, 'CUS002', TRUE),
('2025-04-23 12:00:00', 'Completed', 'Mobile App', 240000.00, 'VCH002', 'CUS003', TRUE),
('2025-04-23 13:00:00', 'Completed', 'Credit Card', 360000.00, 'VCH003', 'CUS004', TRUE),
('2025-04-24 09:00:00', 'Completed', 'Cash', 180000.00, 'VCH004', 'CUS005', TRUE),
('2025-04-24 10:30:00', 'Processing', 'Mobile App', 120000.00, NULL, 'CUS006', TRUE);

UPDATE SHOWTIME_SEAT SET OrderID = 'ORD001' WHERE ShowTimeID = 'SHT001' AND CinemaID = 'CIN001' AND RoomNumber = 1 AND SeatNumber = 'A1' AND OrderID IS NULL;
UPDATE SHOWTIME_SEAT SET OrderID = 'ORD001' WHERE ShowTimeID = 'SHT001' AND CinemaID = 'CIN001' AND RoomNumber = 1 AND SeatNumber = 'A2' AND OrderID IS NULL;
UPDATE SHOWTIME_SEAT SET OrderID = 'ORD003' WHERE ShowTimeID = 'SHT002' AND CinemaID = 'CIN001' AND RoomNumber = 2 AND SeatNumber = 'B1' AND OrderID IS NULL;
UPDATE SHOWTIME_SEAT SET OrderID = 'ORD003' WHERE ShowTimeID = 'SHT002' AND CinemaID = 'CIN001' AND RoomNumber = 2 AND SeatNumber = 'B2' AND OrderID IS NULL;
UPDATE SHOWTIME_SEAT SET OrderID = 'ORD004' WHERE ShowTimeID = 'SHT003' AND CinemaID = 'CIN002' AND RoomNumber = 1 AND SeatNumber = 'C1' AND OrderID IS NULL;
UPDATE SHOWTIME_SEAT SET OrderID = 'ORD004' WHERE ShowTimeID = 'SHT003' AND CinemaID = 'CIN002' AND RoomNumber = 1 AND SeatNumber = 'C2' AND OrderID IS NULL;
UPDATE SHOWTIME_SEAT SET OrderID = 'ORD005' WHERE ShowTimeID = 'SHT004' AND CinemaID = 'CIN002' AND RoomNumber = 2 AND SeatNumber = 'D1' AND OrderID IS NULL;
UPDATE SHOWTIME_SEAT SET OrderID = 'ORD005' WHERE ShowTimeID = 'SHT004' AND CinemaID = 'CIN002' AND RoomNumber = 2 AND SeatNumber = 'D2' AND OrderID IS NULL;

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

-- Tạo dữ liệu mẫu cho FOOD_AND_DRINK
-- Thêm Salted Popcorn
CALL InsertFoodAndDrink('POPCORN', 'Salted Popcorn', 100, TRUE, 50000.00, 'Salted', 'Medium', @item_id1);
-- Thêm Caramel Popcorn
CALL InsertFoodAndDrink('POPCORN', 'Caramel Popcorn', 80, TRUE, 60000.00, 'Caramel', 'Large', @item_id2);
-- Thêm Cola
CALL InsertFoodAndDrink('DRINK', 'Cola', 200, TRUE, 30000.00, NULL, 'Medium', @item_id3);
-- Thêm Pepsi
CALL InsertFoodAndDrink('DRINK', 'Pepsi', 150, TRUE, 30000.00, NULL, 'Large', @item_id4);
-- Thêm Hamburger
CALL InsertFoodAndDrink('OTHERS', 'Hamburger', 50, TRUE, 70000.00, NULL, NULL, @item_id5);








-- -- ------------------------------------------------
-- -- -- Xóa dữ liệu mẫu
-- DELETE FROM SHOWTIME_SEAT;
-- DELETE FROM FOOD_DRINK_ORDER;
-- DELETE FROM ORDERS;
-- DELETE FROM VOUCHER_CONSTRAINT;
-- DELETE FROM VOUCHER;
-- DELETE FROM RATING;
-- DELETE FROM MOVIE_GENRE;
-- DELETE FROM SHOWTIME;
-- DELETE FROM SEAT;
-- DELETE FROM ROOM;
-- DELETE FROM CUSTOMER;
-- DELETE FROM MOVIE;
-- DELETE FROM SCREEN;
-- DELETE FROM DRINK;
-- DELETE FROM POPCORN;
-- DELETE FROM FOOD_AND_DRINK;
-- DELETE FROM CINEMA_PHONE;
-- DELETE FROM CINEMA;
-- DELETE FROM ID_COUNTER;
-- DELETE FROM MANAGER;
-- -- ----------------------------------------------------- 
-- DROP database cinemasystem;
-- -- -----------------------------------------------------

CALL GetCinemaStatistics(@tRevenue, @tTickets, @tMovies);
SELECT 
@tRevenue AS TotalRevenue,
@tTickets AS TotalTicket, 
@tMovies AS TotalMovie;

CALL RevenueByMovie();
CALL TopCustomers(10);
CALL GetHighRatedMovies(7.00);
