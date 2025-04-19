-- Tạo database
CREATE DATABASE IF NOT EXISTS CinemaSystem;
USE CinemaSystem;

-- 1. SCREEN (được ROOM tham chiếu)
CREATE TABLE SCREEN (
    ScreenID INT AUTO_INCREMENT PRIMARY KEY,
    Size VARCHAR(20) NOT NULL,
    SupportedFormat VARCHAR(100) NOT NULL
);

-- 2. CINEMA (được nhiều bảng tham chiếu)
CREATE TABLE CINEMA (
    CinemaID CHAR(6) PRIMARY KEY, -- Ví dụ: CIN001
    Name VARCHAR(100) NOT NULL,
    OpeningHours TIME NOT NULL,
    ClosingHours TIME NOT NULL,
    Location VARCHAR(255) NOT NULL
);

-- 3. CINEMA_PHONE (tham chiếu CINEMA)
CREATE TABLE CINEMA_PHONE (
    PhoneNumber VARCHAR(15) PRIMARY KEY,
    CinemaID CHAR(6),
    FOREIGN KEY (CinemaID) REFERENCES CINEMA(CinemaID)
);

-- 4. ROOM (tham chiếu CINEMA, SCREEN)
CREATE TABLE ROOM (
    RoomNumber INT,
    CinemaID CHAR(6),
    Capacity INT CHECK (Capacity BETWEEN 10 AND 500),
    Type VARCHAR(30),
    ScreenID INT,
    PRIMARY KEY (CinemaID, RoomNumber),
    FOREIGN KEY (CinemaID) REFERENCES CINEMA(CinemaID),
    FOREIGN KEY (ScreenID) REFERENCES SCREEN(ScreenID)
);

-- 5. SEAT (tham chiếu ROOM)
CREATE TABLE SEAT (
    SeatNumber INT,
    RoomNumber INT,
    CinemaID CHAR(6),
    SeatType VARCHAR(30),
    PRIMARY KEY (CinemaID, RoomNumber, SeatNumber),
    FOREIGN KEY (CinemaID, RoomNumber) REFERENCES ROOM(CinemaID, RoomNumber)
);

-- 6. MOVIE (được nhiều bảng tham chiếu)
CREATE TABLE MOVIE (
    MovieID CHAR(6) PRIMARY KEY,
    Title VARCHAR(100) NOT NULL,
    ReleaseDate DATE,
    Duration INT,
    Language VARCHAR(50),
    Description TEXT,
    PosterURL VARCHAR(255),
    AgeRating VARCHAR(10),
    Studio VARCHAR(50),
    Country VARCHAR(50),
    Director VARCHAR(50),
    CustomerRating DECIMAL(3,2)
);

-- 7. CUSTOMER (cần trước để ORDER, RATING dùng)
CREATE TABLE CUSTOMER (
    CustomerID CHAR(8) PRIMARY KEY,
    FullName VARCHAR(100) NOT NULL,
    DateOfBirth DATE,
    Email VARCHAR(100) UNIQUE NOT NULL,
    PhoneNumber VARCHAR(15),
    MembershipLevel VARCHAR(20) DEFAULT 'Standard',
    RegistrationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    TotalSpent DECIMAL(10,2) DEFAULT 0 CHECK (TotalSpent >= 0),
    TotalOrders INT DEFAULT 0 CHECK (TotalOrders >= 0)
);

-- 8. CUSTOMER_SEQUENCE + TRIGGER
CREATE TABLE CUSTOMER_SEQUENCE (
    seq INT PRIMARY KEY AUTO_INCREMENT
);

DELIMITER $$
CREATE TRIGGER trg_before_insert_customer
BEFORE INSERT ON CUSTOMER
FOR EACH ROW
BEGIN
    IF NEW.CustomerID IS NULL THEN
        INSERT INTO CUSTOMER_SEQUENCE VALUES (NULL);
        SET NEW.CustomerID = CONCAT('CUS', LPAD(LAST_INSERT_ID(), 4, '0'));
    END IF;
END$$
DELIMITER ;

-- 9. VOUCHER (ORDER cần nó)
CREATE TABLE VOUCHER (
    VoucherID CHAR(6) PRIMARY KEY,
    Code VARCHAR(20) UNIQUE NOT NULL,
    Description TEXT,
    DiscountAmount DECIMAL(5,2),
    DiscountType VARCHAR(10), -- %, amount
    IssueDate DATE,
    ExpirationDate DATE,
    MaxUsage INT,
    UsedCount INT DEFAULT 0,
    IsActive BOOLEAN DEFAULT TRUE
);

-- 10. VOUCHER_CONSTRAINT
CREATE TABLE VOUCHER_CONSTRAINT (
    VoucherID CHAR(6),
    Type VARCHAR(20),
    Above DECIMAL(10,2),
    Below DECIMAL(10,2),
    PRIMARY KEY (VoucherID, Type),
    FOREIGN KEY (VoucherID) REFERENCES VOUCHER(VoucherID)
);

-- 11. ORDER (phụ thuộc VOUCHER, CUSTOMER)
CREATE TABLE `ORDER` (
    OrderID INT AUTO_INCREMENT PRIMARY KEY,
    Date DATE NOT NULL,
    Time TIME NOT NULL,
    Status VARCHAR(30),
    PaymentMethod VARCHAR(30),
    TotalPrice DECIMAL(10,2) NOT NULL CHECK (TotalPrice >= 0),
    VoucherID CHAR(6),
    CustomerID CHAR(8),
    isTicket BOOLEAN DEFAULT FALSE,
    isFood BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (VoucherID) REFERENCES VOUCHER(VoucherID),
    FOREIGN KEY (CustomerID) REFERENCES CUSTOMER(CustomerID)
);

-- 12. SHOWTIME (MovieID trước, RoomID không có bảng riêng nên OK)
CREATE TABLE SHOWTIME (
    RoomID INT,
    MovieID CHAR(6),
    StartTime DATETIME,
    Duration INT,
    Format VARCHAR(30),
    Subtitle BOOLEAN,
    Dub BOOLEAN,
    PRIMARY KEY (RoomID, MovieID, StartTime),
    FOREIGN KEY (MovieID) REFERENCES MOVIE(MovieID)
);

-- 13. SHOWTIME_SEAT (ORDER phải trước)
CREATE TABLE SHOWTIME_SEAT (
    RoomID INT,
    MovieID CHAR(6),
    StartTime DATETIME,
    SeatNumber INT,
    Status VARCHAR(20),
    OrderID INT,
    Price DECIMAL(6,2) NOT NULL CHECK (Price >= 0),
    PRIMARY KEY (RoomID, MovieID, StartTime, SeatNumber),
    FOREIGN KEY (OrderID) REFERENCES `ORDER`(OrderID)
);

-- 14. FOOD_AND_DRINK
CREATE TABLE FOOD_AND_DRINK (
    ItemID CHAR(6) PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Price DECIMAL(6,2) NOT NULL,
    IsAvailable BOOLEAN DEFAULT TRUE,
    StockQuantity INT DEFAULT 0
);

-- 15. FOOD_DRINK_ORDER
CREATE TABLE FOOD_DRINK_ORDER (
    ItemID CHAR(6),
    OrderID INT,
    Quantity INT CHECK (Quantity > 0),
    PRIMARY KEY (ItemID, OrderID),
    FOREIGN KEY (ItemID) REFERENCES FOOD_AND_DRINK(ItemID),
    FOREIGN KEY (OrderID) REFERENCES `ORDER`(OrderID)
);

-- 16. RATING
CREATE TABLE RATING (
    MovieID CHAR(6),
    CustomerID CHAR(8),
    Score INT CHECK (Score BETWEEN 1 AND 10),
    Comment TEXT,
    RatingDate DATE,
    PRIMARY KEY (MovieID, CustomerID),
    FOREIGN KEY (MovieID) REFERENCES MOVIE(MovieID),
    FOREIGN KEY (CustomerID) REFERENCES CUSTOMER(CustomerID)
);

-- 17. POPCORN
CREATE TABLE POPCORN (
    ItemID CHAR(6) PRIMARY KEY,
    Flavour VARCHAR(50),
    FOREIGN KEY (ItemID) REFERENCES FOOD_AND_DRINK(ItemID)
);

-- 18. DRINK
CREATE TABLE DRINK (
    ItemID CHAR(6) PRIMARY KEY,
    Size VARCHAR(20),
    FOREIGN KEY (ItemID) REFERENCES FOOD_AND_DRINK(ItemID)
);

-- 19. MOVIE_GENRE
CREATE TABLE MOVIE_GENRE (
    Genre VARCHAR(30),
    MovieID CHAR(6),
    PRIMARY KEY (Genre, MovieID),
    FOREIGN KEY (MovieID) REFERENCES MOVIE(MovieID)
);

SET SQL_SAFE_UPDATES = 0;

DELETE FROM MOVIE;
DELETE FROM MOVIE_GENRE;
DELETE FROM RATING;
DELETE FROM SHOWTIME_SEAT;
DELETE FROM FOOD_DRINK_ORDER;
DELETE FROM POPCORN;
DELETE FROM DRINK;
DELETE FROM FOOD_AND_DRINK;
DELETE FROM `ORDER`;
DELETE FROM VOUCHER_CONSTRAINT;
DELETE FROM VOUCHER;
DELETE FROM SHOWTIME;
DELETE FROM SEAT;
DELETE FROM ROOM;
DELETE FROM CINEMA_PHONE;
DELETE FROM CINEMA;
DELETE FROM SCREEN;
DELETE FROM CUSTOMER;
DELETE FROM CUSTOMER_SEQUENCE;

INSERT INTO MOVIE (MovieID, Title, ReleaseDate, Duration, Language, Description, PosterURL, AgeRating, Studio, Country, Director, CustomerRating) VALUES
('MOV001', 'Inside Out 2', '2024-06-14', 96, 'English', 'Riley navigates teenage emotions with new feelings like Anxiety.', 'https://images.unsplash.com/photo-1637858868799-7f26a0640eb6?q=80&w=2940&auto=format&fit=crop', 'PG', 'Pixar', 'USA', 'Kelsey Mann', 7.50),
('MOV002', 'Deadpool & Wolverine', '2024-07-26', 127, 'English', 'Deadpool and Wolverine team up to save the multiverse.', 'https://www.cinematerial.com/media/posters/md/0p/0p4z1l0b.jpg', 'R', 'Marvel', 'USA', 'Shawn Levy', 7.60),
('MOV003', 'Wicked', '2024-11-27', 170, 'English', 'Elphaba and Glinda’s story before becoming the Wicked Witch.', 'https://upload.wikimedia.org/wikipedia/en/5/5f/Wicked_%282024_film%29_poster.jpg', 'PG', 'Universal', 'USA', 'Jon M. Chu', 6.80),
('MOV004', 'Moana 2', '2024-11-29', 100, 'English', 'Moana’s new ocean adventure with Maui and a new crew.', 'https://d23.com/wp-content/uploads/2024/05/Moana-2-Poster-1-1536x864.jpg', 'PG', 'Disney', 'USA', 'David G. Derrick Jr.', 6.20),
('MOV005', 'Captain America: Brave New World', '2025-02-14', 135, 'English', 'Sam Wilson faces a global conspiracy as Captain America.', 'https://www.cinematerial.com/media/posters/md/4k/4k3z2m0b.jpg', 'PG-13', 'Marvel', 'USA', 'Julius Onah', 6.50),
('MOV006', 'Snow White', '2025-03-21', 120, 'English', 'Live-action remake of Snow White and the Seven Dwarfs.', 'https://www.cinematerial.com/media/posters/md/9x/9x7z3n0c.jpg', 'PG', 'Disney', 'USA', 'Marc Webb', 6.00),
('MOV007', 'Thunderbolts*', '2025-05-02', 130, 'English', 'Antiheroes unite for a dangerous mission.', 'https://www.cinematerial.com/media/posters/md/2q/2q8z4p0d.jpg', 'PG-13', 'Marvel', 'USA', 'Jake Schreier', 6.30),
('MOV008', 'Lilo & Stitch', '2025-05-23', 110, 'English', 'Live-action remake of Lilo & Stitch’s alien adventure.', 'https://www.cinematerial.com/media/posters/md/7y/7y9z5q0e.jpg', 'PG', 'Disney', 'USA', 'Dean Fleischer Camp', 6.10),
('MOV009', 'Elio', '2025-06-20', 105, 'English', 'A boy’s cosmic misadventure with aliens.', 'https://www.cinematerial.com/media/posters/md/3r/3r0z6r0f.jpg', 'PG', 'Pixar', 'USA', 'Adrian Molina', 6.40),
('MOV010', 'The Fantastic Four: First Steps', '2025-07-25', 140, 'English', 'The Fantastic Four battle Galactus to save Earth.', 'https://www.cinematerial.com/media/posters/md/5s/5s1z7s0g.jpg', 'PG-13', 'Marvel', 'USA', 'Matt Shakman', 6.70),
('MOV011', 'Freakier Friday', '2025-08-08', 115, 'English', 'A mother-daughter body swap sequel with new twists.', 'https://www.cinematerial.com/media/posters/md/8t/8t2z8t0h.jpg', 'PG', 'Disney', 'USA', 'Nisha Ganatra', 6.20),
('MOV012', 'Zootopia 2', '2025-11-26', 110, 'English', 'Judy and Nick tackle a new case in Zootopia.', 'https://www.cinematerial.com/media/posters/md/6u/6u3z9u0i.jpg', 'PG', 'Disney', 'USA', 'Jared Bush', 6.50),
('MOV013', 'Avatar: Fire and Ash', '2025-12-19', 160, 'English', 'Jake Sully faces new threats on Pandora.', 'https://www.cinematerial.com/media/posters/md/4v/4v4z0v0j.jpg', 'PG-13', '20th Century', 'USA', 'James Cameron', 7.00),
('MOV014', 'Mufasa: The Lion King', '2024-12-20', 119, 'English', 'The origin story of Mufasa, Simba’s father.', 'https://upload.wikimedia.org/wikipedia/en/2/2f/Mufasa_The_Lion_King_poster.jpg', 'PG', 'Disney', 'USA', 'Barry Jenkins', 6.90),
('MOV015', 'Dune: Part Two', '2024-03-01', 166, 'English', 'Paul Atreides unites Fremen to fight for Arrakis.', 'https://www.cinematerial.com/media/posters/md/1w/1w5z1w0k.jpg', 'PG-13', 'Warner Bros.', 'USA', 'Denis Villeneuve', 8.60),
('MOV016', 'Furiosa: A Mad Max Saga', '2024-05-24', 148, 'English', 'Young Furiosa’s origin in a post-apocalyptic world.', 'https://www.cinematerial.com/media/posters/md/3x/3x6z2x0l.jpg', 'R', 'Warner Bros.', 'Australia', 'George Miller', 7.80),
('MOV017', 'The Fall Guy', '2024-05-03', 126, 'English', 'A stuntman’s action-packed quest to save a film.', 'https://www.cinematerial.com/media/posters/md/9y/9y7z3y0m.jpg', 'PG-13', 'Universal', 'USA', 'David Leitch', 7.10),
('MOV018', 'Kingdom of the Planet of the Apes', '2024-05-10', 145, 'English', 'A new ape civilization rises after Caesar’s reign.', 'https://www.cinematerial.com/media/posters/md/2z/2z8z4z0n.jpg', 'PG-13', '20th Century', 'USA', 'Wes Ball', 7.20),
('MOV019', 'A Quiet Place: Day One', '2024-06-28', 99, 'English', 'Survivors face aliens in New York’s invasion.', 'https://www.cinematerial.com/media/posters/md/5a/5a0z5a0o.jpg', 'PG-13', 'Paramount', 'USA', 'Michael Sarnoski', 6.80),
('MOV020', 'Twisters', '2024-07-19', 122, 'English', 'Storm chasers confront deadly tornadoes.', 'https://www.cinematerial.com/media/posters/md/7b/7b1z6b0p.jpg', 'PG-13', 'Universal', 'USA', 'Lee Isaac Chung', 7.00);

-- 1. SCREEN
INSERT INTO SCREEN (Size, SupportedFormat) VALUES
('Large', 'IMAX, 3D, Dolby Atmos'),
('Medium', '4DX, 2D'),
('Small', '2D, Standard'),
('Large', 'IMAX, 4K'),
('Medium', '3D, Dolby Vision');

-- 2. CINEMA
INSERT INTO CINEMA (CinemaID, Name, OpeningHours, ClosingHours, Location) VALUES
('CIN001', 'CGV Vincom Mega Mall', '09:00:00', '23:00:00', 'Quận 2, TP.HCM'),
('CIN002', 'Lotte Cinema Cantavil', '10:00:00', '22:30:00', 'Quận 7, TP.HCM'),
('CIN003', 'Galaxy Tân Bình', '09:30:00', '23:30:00', 'Quận Tân Bình, TP.HCM'),
('CIN004', 'BHD Star Thảo Điền', '10:00:00', '23:00:00', 'Quận 2, TP.HCM'),
('CIN005', 'CGV Landmark 81', '09:00:00', '23:00:00', 'Quận Bình Thạnh, TP.HCM');

-- 3. CINEMA_PHONE
INSERT INTO CINEMA_PHONE (PhoneNumber, CinemaID) VALUES
('02873001234', 'CIN001'),
('02873005678', 'CIN001'),
('02838201234', 'CIN002'),
('02839101234', 'CIN003'),
('02839105678', 'CIN004'),
('02873009876', 'CIN005');

-- 4. ROOM
INSERT INTO ROOM (RoomNumber, CinemaID, Capacity, Type, ScreenID) VALUES
(1, 'CIN001', 200, 'VIP', 1),
(2, 'CIN001', 150, 'Standard', 2),
(1, 'CIN002', 100, 'Standard', 3),
(2, 'CIN002', 120, 'VIP', 4),
(1, 'CIN003', 80, 'Standard', 5),
(1, 'CIN004', 90, 'VIP', 3),
(1, 'CIN005', 180, 'IMAX', 1);

-- 5. SEAT
INSERT INTO SEAT (SeatNumber, RoomNumber, CinemaID, SeatType) VALUES
(1, 1, 'CIN001', 'VIP'),
(2, 1, 'CIN001', 'VIP'),
(3, 1, 'CIN001', 'Standard'),
(1, 2, 'CIN001', 'Standard'),
(2, 2, 'CIN001', 'Standard'),
(1, 1, 'CIN002', 'Standard'),
(2, 1, 'CIN002', 'Standard'),
(1, 2, 'CIN002', 'VIP'),
(1, 1, 'CIN003', 'Standard'),
(1, 1, 'CIN004', 'VIP'),
(1, 1, 'CIN005', 'IMAX');

-- 6. CUSTOMER
-- Trigger sẽ tự động tạo CustomerID (CUSxxxx)
INSERT INTO CUSTOMER (FullName, DateOfBirth, Email, PhoneNumber, MembershipLevel, RegistrationDate, TotalSpent, TotalOrders) VALUES
('Nguyễn Văn An', '1995-03-12', 'an.nguyen@example.com', '0912345678', 'Gold', '2025-04-01 10:00:00', 500.00, 8),
('Trần Thị Bé', '1988-07-25', 'be.tran@example.com', '0987654321', 'Standard', '2025-03-15 14:30:00', 150.00, 3),
('Lê Hoàng Cường', '1992-11-30', 'cuong.le@example.com', '0978123456', 'Silver', '2025-04-10 09:15:00', 300.00, 5),
('Phạm Thị Duyên', '1997-05-05', 'duyen.pham@example.com', '0909123456', 'Standard', '2025-04-12 16:20:00', 80.00, 2),
('Hoàng Văn Em', '1990-09-18', 'em.hoang@example.com', '0935123456', 'Gold', '2025-03-20 11:00:00', 600.00, 10);

-- 7. VOUCHER
INSERT INTO VOUCHER (VoucherID, Code, Description, DiscountAmount, DiscountType, IssueDate, ExpirationDate, MaxUsage, UsedCount, IsActive) VALUES
('VOU001', 'SUMMER10', '10% off for summer bookings', 10.00, '%', '2025-06-01', '2025-08-31', 200, 50, TRUE),
('VOU002', 'NEWUSER15', '15% off for new members', 15.00, '%', '2025-01-01', '2025-12-31', 100, 20, TRUE),
('VOU003', 'VIP20', '20% off for VIP members', 20.00, '%', '2025-04-01', '2025-09-30', 150, 30, TRUE),
('VOU004', 'TICKET5', '$5 off on tickets', 5.00, 'amount', '2025-03-01', '2025-06-30', 300, 100, TRUE),
('VOU005', 'COMBO10', '10% off on food combos', 10.00, '%', '2025-05-01', '2025-11-30', 250, 80, TRUE);

-- 8. VOUCHER_CONSTRAINT
INSERT INTO VOUCHER_CONSTRAINT (VoucherID, Type, Above, Below) VALUES
('VOU001', 'Order', 50.00, NULL),
('VOU002', 'Order', 0.00, NULL),
('VOU003', 'Membership', 0.00, NULL),
('VOU004', 'Ticket', 20.00, NULL),
('VOU005', 'Food', 15.00, NULL);

-- 9. ORDER
INSERT INTO `ORDER` (Date, Time, Status, PaymentMethod, TotalPrice, VoucherID, CustomerID, isTicket, isFood) VALUES
('2025-04-15', '14:00:00', 'Completed', 'Card', 45.00, 'VOU001', 'CUS0001', TRUE, TRUE),
('2025-04-16', '18:30:00', 'Completed', 'Cash', 20.00, NULL, 'CUS0002', TRUE, FALSE),
('2025-04-17', '20:00:00', 'Pending', 'Mobile', 60.00, 'VOU003', 'CUS0003', TRUE, TRUE),
('2025-04-18', '16:15:00', 'Completed', 'Card', 15.00, 'VOU004', 'CUS0004', FALSE, TRUE),
('2025-04-18', '19:00:00', 'Completed', 'Card', 35.00, 'VOU005', 'CUS0005', TRUE, FALSE);

-- 10. SHOWTIME
INSERT INTO SHOWTIME (RoomID, MovieID, StartTime, Duration, Format, Subtitle, Dub) VALUES
(1, 'MOV001', '2025-04-20 14:00:00', 96, '3D', TRUE, FALSE),
(2, 'MOV002', '2025-04-20 18:30:00', 127, '4DX', FALSE, TRUE),
(1, 'MOV003', '2025-04-21 20:00:00', 170, '2D', TRUE, FALSE),
(2, 'MOV004', '2025-04-21 16:00:00', 100, 'IMAX', TRUE, FALSE),
(1, 'MOV005', '2025-04-22 15:00:00', 135, 'Dolby Atmos', TRUE, FALSE),
(1, 'MOV014', '2025-04-22 19:00:00', 119, '2D', TRUE, FALSE);

-- 11. SHOWTIME_SEAT
INSERT INTO SHOWTIME_SEAT (RoomID, MovieID, StartTime, SeatNumber, Status, OrderID, Price) VALUES
(1, 'MOV001', '2025-04-20 14:00:00', 1, 'Booked', 1, 12.00),
(1, 'MOV001', '2025-04-20 14:00:00', 2, 'Booked', 1, 12.00),
(2, 'MOV002', '2025-04-20 18:30:00', 1, 'Available', NULL, 15.00),
(1, 'MOV003', '2025-04-21 20:00:00', 1, 'Booked', 3, 18.00),
(2, 'MOV004', '2025-04-21 16:00:00', 1, 'Booked', 5, 20.00),
(1, 'MOV005', '2025-04-22 15:00:00', 1, 'Available', NULL, 14.00);

-- 12. FOOD_AND_DRINK
INSERT INTO FOOD_AND_DRINK (ItemID, Name, Price, IsAvailable, StockQuantity) VALUES
('FOD001', 'Popcorn Small', 4.50, TRUE, 200),
('FOD002', 'Popcorn Large', 7.00, TRUE, 100),
('FOD003', 'Coke 500ml', 3.50, TRUE, 300),
('FOD004', 'Nachos with Cheese', 6.00, TRUE, 80),
('FOD005', 'Hot Dog', 5.00, TRUE, 50),
('FOD006', 'Pepsi 500ml', 3.50, TRUE, 250);

-- 13. FOOD_DRINK_ORDER
INSERT INTO FOOD_DRINK_ORDER (ItemID, OrderID, Quantity) VALUES
('FOD001', 1, 2),
('FOD003', 1, 1),
('FOD002', 3, 1),
('FOD004', 4, 2),
('FOD005', 4, 1),
('FOD006', 3, 2);

-- 14. RATING
INSERT INTO RATING (MovieID, CustomerID, Score, Comment, RatingDate) VALUES
('MOV001', 'CUS0001', 8, 'Cảm xúc và hài hước!', '2025-04-21'),
('MOV002', 'CUS0002', 7, 'Hành động đỉnh cao.', '2025-04-21'),
('MOV003', 'CUS0003', 9, 'Nhạc và hình ảnh đẹp.', '2025-04-22'),
('MOV004', 'CUS0004', 6, 'Cốt truyện hơi đơn giản.', '2025-04-22'),
('MOV005', 'CUS0005', 7, 'Hành động hấp dẫn.', '2025-04-23');

-- 15. POPCORN
INSERT INTO POPCORN (ItemID, Flavour) VALUES
('FOD001', 'Salted'),
('FOD002', 'Caramel');

-- 16. DRINK
INSERT INTO DRINK (ItemID, Size) VALUES
('FOD003', 'Medium'),
('FOD006', 'Medium');

-- 17. MOVIE_GENRE
INSERT INTO MOVIE_GENRE (Genre, MovieID) VALUES
('Animation', 'MOV001'),
('Family', 'MOV001'),
('Action', 'MOV002'),
('Comedy', 'MOV002'),
('Musical', 'MOV003'),
('Fantasy', 'MOV003'),
('Animation', 'MOV004'),
('Adventure', 'MOV004'),
('Action', 'MOV005'),
('Sci-Fi', 'MOV005'),
('Fantasy', 'MOV006'),
('Family', 'MOV006'),
('Action', 'MOV007'),
('Adventure', 'MOV007'),
('Family', 'MOV008'),
('Sci-Fi', 'MOV009'),
('Animation', 'MOV009'),
('Action', 'MOV010'),
('Sci-Fi', 'MOV010'),
('Comedy', 'MOV011'),
('Family', 'MOV011'),
('Animation', 'MOV012'),
('Comedy', 'MOV012'),
('Sci-Fi', 'MOV013'),
('Adventure', 'MOV013'),
('Animation', 'MOV014'),
('Drama', 'MOV014'),
('Sci-Fi', 'MOV015'),
('Drama', 'MOV015'),
('Action', 'MOV016'),
('Sci-Fi', 'MOV016'),
('Action', 'MOV017'),
('Comedy', 'MOV017'),
('Sci-Fi', 'MOV018'),
('Action', 'MOV018'),
('Horror', 'MOV019'),
('Thriller', 'MOV019'),
('Action', 'MOV020'),
('Thriller', 'MOV020');


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