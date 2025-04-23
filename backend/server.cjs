// server.js
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Kết nối database
const db = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "", // password: "mysql password"
  database: "",
});

// Kiểm tra kết nối
db.connect((err) => {
  if (err) {
    console.error("Lỗi kết nối MySQL:", err);
    return;
  }
  console.log("Đã kết nối thành công đến MySQL");
});

// Route kiểm tra server
app.get("/", (req, res) => {
  res.send("Server đang chạy!");
});

// API lấy danh sách Cinema kèm số điện thoại
app.get("/api/cinemas", (req, res) => {
  const query = `
    SELECT 
      c.CinemaID,
      c.Name,
      TIME_FORMAT(c.OpeningHours, '%H:%i') AS OpeningHours,
      TIME_FORMAT(c.ClosingHours, '%H:%i') AS ClosingHours,
      c.Location,
      GROUP_CONCAT(cp.PhoneNumber) AS PhoneNumbers
    FROM CINEMA c
    LEFT JOIN CINEMA_PHONE cp ON c.CinemaID = cp.CinemaID
    GROUP BY c.CinemaID
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy danh sách Cinema:", err);
      return res
        .status(500)
        .json({ message: "Lỗi server", error: err.message });
    }
    if (results.length === 0) {
      return res
        .status(200)
        .json({ message: "Không có rạp chiếu phim nào", data: [] });
    }
    // Chuyển PhoneNumbers từ chuỗi (phân tách bằng dấu phẩy) thành mảng
    const formattedResults = results.map((cinema) => ({
      ...cinema,
      PhoneNumbers: cinema.PhoneNumbers ? cinema.PhoneNumbers.split(",") : [],
    }));
    res.json({ data: formattedResults });
  });
});

// API lấy thông tin Cinema theo ID
app.get("/api/cinemas/:id", (req, res) => {
  const cinemaId = req.params.id;

  if (!cinemaId) {
    return res.status(400).json({ message: "Thiếu ID của Cinema" });
  }

  // Query để lấy thông tin cơ bản của Cinema
  const cinemaQuery = `
    SELECT * FROM CINEMA 
    WHERE CinemaID = ?
  `;

  // Query để lấy danh sách số điện thoại của Cinema
  const phoneQuery = `
    SELECT PhoneNumber FROM CINEMA_PHONE
    WHERE CinemaID = ?
  `;

  // Thực hiện cả hai query song song
  Promise.all([
    new Promise((resolve, reject) => {
      db.query(cinemaQuery, [cinemaId], (err, results) => {
        if (err) reject(err);
        else resolve(results[0]); // Lấy bản ghi đầu tiên
      });
    }),
    new Promise((resolve, reject) => {
      db.query(phoneQuery, [cinemaId], (err, results) => {
        if (err) reject(err);
        else resolve(results.map((row) => row.PhoneNumber)); // Chuyển thành mảng số điện thoại
      });
    }),
  ])
    .then(([cinema, phoneNumbers]) => {
      if (!cinema) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy Cinema với ID này" });
      }

      // Kết hợp thông tin Cinema và số điện thoại
      const response = {
        ...cinema,
        PhoneNumbers: phoneNumbers,
      };

      res.status(200).json(response);
    })
    .catch((err) => {
      console.error("Lỗi khi lấy thông tin Cinema:", err);
      res.status(500).json({
        message: "Lỗi server",
        error: err.message,
      });
    });
});

// API endpoint lấy danh sách phim
app.get("/api/movies", (req, res) => {
  const query = `
    SELECT 
      m.*, 
      GROUP_CONCAT(mg.Genre) AS Genres
    FROM MOVIE m
    LEFT JOIN MOVIE_GENRE mg ON m.MovieID = mg.MovieID
    GROUP BY m.MovieID
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy danh sách phim:", err);
      return res
        .status(500)
        .json({ message: "Lỗi server", error: err.message });
    }
    res.json(results);
  });
});

// API endpoint lấy chi tiết phim theo ID
app.get("/api/movies/:id", (req, res) => {
  const movieId = req.params.id;
  const query = `
    SELECT 
      m.*, 
      GROUP_CONCAT(mg.Genre) AS Genres
    FROM MOVIE m
    LEFT JOIN MOVIE_GENRE mg ON m.MovieID = mg.MovieID
    WHERE m.MovieID = ?
    GROUP BY m.MovieID
  `;

  db.query(query, [movieId], (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy thông tin phim:", err);
      return res
        .status(500)
        .json({ message: "Lỗi server", error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy phim" });
    }
    res.json(results[0]);
  });
});

// API endpoint thêm phim mới
app.post("/api/movies", (req, res) => {
  const {
    MovieID,
    Title,
    ReleaseDate,
    Duration,
    Language,
    Description,
    PosterURL,
    AgeRating,
    Studio,
    Country,
    Director,
    CustomerRating,
    Genres,
  } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!MovieID || !Title || !Duration || !ReleaseDate) {
    return res.status(400).json({
      message:
        "Thiếu các trường bắt buộc: MovieID, Title, Duration, ReleaseDate",
    });
  }

  // Thêm vào bảng MOVIE
  const movieQuery = `
    INSERT INTO MOVIE
    (MovieID, Title, ReleaseDate, Duration, Language, Description, PosterURL, AgeRating, Studio, Country, Director, CustomerRating)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    movieQuery,
    [
      MovieID,
      Title,
      ReleaseDate,
      Duration,
      Language || null,
      Description || null,
      PosterURL || null,
      AgeRating || null,
      Studio || null,
      Country || null,
      Director || null,
      CustomerRating || 0,
    ],
    (err, result) => {
      if (err) {
        console.error("Lỗi khi thêm phim:", err);
        return res
          .status(500)
          .json({ message: "Lỗi khi thêm phim", error: err.message });
      }

      // Thêm thể loại vào MOVIE_GENRE
      if (Genres && typeof Genres === "string" && Genres.trim()) {
        // Loại bỏ thể loại trùng lặp và kiểm tra độ dài
        const genresArray = [
          ...new Set(Genres.split(",").map((g) => g.trim())),
        ];
        const maxGenreLength = 50; // Giới hạn độ dài của cột Genre trong bảng MOVIE_GENRE
        const invalidGenres = genresArray.filter(
          (genre) => genre.length > maxGenreLength
        );

        if (invalidGenres.length > 0) {
          return res.status(400).json({
            message: `Thể loại không hợp lệ: Các thể loại sau vượt quá ${maxGenreLength} ký tự: ${invalidGenres.join(
              ", "
            )}`,
          });
        }

        const genreQueries = genresArray.map((genre) => {
          return new Promise((resolve, reject) => {
            db.query(
              "INSERT INTO MOVIE_GENRE (Genre, MovieID) VALUES (?, ?)",
              [genre, MovieID],
              (err) => {
                if (err) reject(err);
                else resolve();
              }
            );
          });
        });

        Promise.all(genreQueries)
          .then(() => {
            res.status(201).json({
              message: "Phim đã được thêm thành công",
              movie: { MovieID, Title, ReleaseDate, Duration, Genres },
            });
          })
          .catch((err) => {
            console.error("Lỗi khi thêm thể loại:", err);
            res
              .status(500)
              .json({ message: "Lỗi khi thêm thể loại", error: err.message });
          });
      } else {
        res.status(201).json({
          message: "Phim đã được thêm thành công (không có thể loại)",
          movie: { MovieID, Title, ReleaseDate, Duration },
        });
      }
    }
  );
});

// API endpoint cập nhật phim
app.put("/api/movies/:id", (req, res) => {
  const movieId = req.params.id;
  const {
    Title,
    ReleaseDate,
    Duration,
    Language,
    Description,
    PosterURL,
    AgeRating,
    Studio,
    Country,
    Director,
    CustomerRating,
    Genres,
  } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!Title || !Duration || !ReleaseDate) {
    return res.status(400).json({
      message: "Thiếu các trường bắt buộc: Title, Duration, ReleaseDate",
    });
  }

  // Cập nhật bảng MOVIE
  const movieQuery = `
    UPDATE MOVIE
    SET Title = ?, ReleaseDate = ?, Duration = ?, Language = ?, Description = ?,
        PosterURL = ?, AgeRating = ?, Studio = ?, Country = ?, Director = ?, CustomerRating = ?
    WHERE MovieID = ?
  `;

  db.query(
    movieQuery,
    [
      Title,
      ReleaseDate,
      Duration,
      Language || null,
      Description || null,
      PosterURL || null,
      AgeRating || null,
      Studio || null,
      Country || null,
      Director || null,
      CustomerRating || 0,
      movieId,
    ],
    (err, result) => {
      if (err) {
        console.error("Lỗi khi cập nhật phim:", err);
        return res
          .status(500)
          .json({ message: "Lỗi khi cập nhật phim", error: err.message });
      }
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy phim để cập nhật" });
      }

      // Xóa thể loại cũ
      db.query(
        "DELETE FROM MOVIE_GENRE WHERE MovieID = ?",
        [movieId],
        (err) => {
          if (err) {
            console.error("Lỗi khi xóa thể loại cũ:", err);
            return res
              .status(500)
              .json({ message: "Lỗi khi xóa thể loại cũ", error: err.message });
          }

          // Thêm thể loại mới
          if (Genres && typeof Genres === "string" && Genres.trim()) {
            const genresArray = [
              ...new Set(Genres.split(",").map((g) => g.trim())),
            ];
            const maxGenreLength = 50;
            const invalidGenres = genresArray.filter(
              (genre) => genre.length > maxGenreLength
            );

            if (invalidGenres.length > 0) {
              return res.status(400).json({
                message: `Thể loại không hợp lệ: Các thể loại sau vượt quá ${maxGenreLength} ký tự: ${invalidGenres.join(
                  ", "
                )}`,
              });
            }

            const genreQueries = genresArray.map((genre) => {
              return new Promise((resolve, reject) => {
                db.query(
                  "INSERT INTO MOVIE_GENRE (Genre, MovieID) VALUES (?, ?)",
                  [genre, movieId],
                  (err) => {
                    if (err) reject(err);
                    else resolve();
                  }
                );
              });
            });

            Promise.all(genreQueries)
              .then(() => {
                res.json({
                  message: "Phim đã được cập nhật thành công",
                  movie: {
                    MovieID: movieId,
                    Title,
                    ReleaseDate,
                    Duration,
                    Genres,
                  },
                });
              })
              .catch((err) => {
                console.error("Lỗi khi thêm thể loại mới:", err);
                res.status(500).json({
                  message: "Lỗi khi thêm thể loại mới",
                  error: err.message,
                });
              });
          } else {
            res.json({
              message: "Phim đã được cập nhật thành công (không có thể loại)",
              movie: { MovieID: movieId, Title, ReleaseDate, Duration },
            });
          }
        }
      );
    }
  );
});

// API endpoint xóa phim
app.delete("/api/movies/:id", (req, res) => {
  const movieId = req.params.id;

  // Xóa thể loại trước
  db.query("DELETE FROM MOVIE_GENRE WHERE MovieID = ?", [movieId], (err) => {
    if (err) {
      console.error("Lỗi khi xóa thể loại:", err);
      return res
        .status(500)
        .json({ message: "Lỗi khi xóa thể loại", error: err.message });
    }

    // Xóa phim
    db.query(
      "DELETE FROM MOVIE WHERE MovieID = ?",
      [movieId],
      (err, result) => {
        if (err) {
          console.error("Lỗi khi xóa phim:", err);
          return res
            .status(500)
            .json({ message: "Lỗi khi xóa phim", error: err.message });
        }
        if (result.affectedRows === 0) {
          return res
            .status(404)
            .json({ message: "Không tìm thấy phim để xóa" });
        }
        res.json({ message: "Phim đã được xóa thành công" });
      }
    );
  });
});

// API thêm Cinema
app.post("/api/cinemas", (req, res) => {
  const { CinemaID, Name, OpeningHours, ClosingHours, Location, PhoneNumbers } =
    req.body;

  if (!CinemaID || !Name || !OpeningHours || !ClosingHours || !Location) {
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
  }

  const query = `
    INSERT INTO CINEMA (CinemaID, Name, OpeningHours, ClosingHours, Location)
    VALUES (?, ?, ?, ?, ?)
  `;

  console.log("Thêm Cinema với thông tin:", {
    CinemaID,
    Name,
    OpeningHours,
    ClosingHours,
    Location,
    PhoneNumbers,
  });
  db.query(
    query,
    [CinemaID, Name, OpeningHours, ClosingHours, Location],
    (err) => {
      if (err) {
        console.error("Lỗi khi thêm Cinema:", err);
        return res
          .status(500)
          .json({ message: "Lỗi server", error: err.message });
      }

      if (
        PhoneNumbers &&
        Array.isArray(PhoneNumbers) &&
        PhoneNumbers.length > 0
      ) {
        const phoneQueries = PhoneNumbers.map((phone) => {
          return new Promise((resolve, reject) => {
            db.query(
              "INSERT INTO CINEMA_PHONE (PhoneNumber, CinemaID) VALUES (?, ?)",
              [phone, CinemaID],
              (err) => {
                if (err) reject(err);
                else resolve();
              }
            );
          });
        });

        Promise.all(phoneQueries)
          .then(() => {
            res.status(201).json({
              message: "Cinema và số điện thoại đã được thêm thành công",
            });
          })
          .catch((err) => {
            console.error("Lỗi khi thêm số điện thoại:", err);
            res.status(500).json({
              message: "Lỗi khi thêm số điện thoại",
              error: err.message,
            });
          });
      } else {
        res.status(201).json({ message: "Cinema đã được thêm thành công" });
      }
    }
  );
});

// API cập nhật Cinema
app.put("/api/cinemas/:id", (req, res) => {
  const cinemaId = req.params.id; // Lấy ID từ URL params
  const { Name, OpeningHours, ClosingHours, Location, PhoneNumbers } = req.body;

  if (!Name || !OpeningHours || !ClosingHours || !Location) {
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
  }

  const query = `
    UPDATE CINEMA
    SET Name = ?, OpeningHours = ?, ClosingHours = ?, Location = ?
    WHERE CinemaID = ?
  `;

  db.query(
    query,
    [Name, OpeningHours, ClosingHours, Location, cinemaId], // Sử dụng cinemaId từ params
    (err, result) => {
      if (err) {
        console.error("Lỗi khi cập nhật Cinema:", err);
        return res
          .status(500)
          .json({ message: "Lỗi server", error: err.message });
      }

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy Cinema để cập nhật" });
      }

      // Xóa số điện thoại cũ
      db.query(
        "DELETE FROM CINEMA_PHONE WHERE CinemaID = ?",
        [cinemaId],
        (err) => {
          if (err) {
            console.error("Lỗi khi xóa số điện thoại cũ:", err);
            return res.status(500).json({
              message: "Lỗi khi xóa số điện thoại cũ",
              error: err.message,
            });
          }

          // Thêm số điện thoại mới
          if (
            PhoneNumbers &&
            Array.isArray(PhoneNumbers) &&
            PhoneNumbers.length > 0
          ) {
            const phoneQueries = PhoneNumbers.map((phone) => {
              return new Promise((resolve, reject) => {
                db.query(
                  "INSERT INTO CINEMA_PHONE (PhoneNumber, CinemaID) VALUES (?, ?)",
                  [phone, cinemaId], // Sử dụng cinemaId từ params
                  (err) => {
                    if (err) reject(err);
                    else resolve();
                  }
                );
              });
            });

            Promise.all(phoneQueries)
              .then(() => {
                res.json({
                  message:
                    "Cinema và số điện thoại đã được cập nhật thành công",
                });
              })
              .catch((err) => {
                console.error("Lỗi khi thêm số điện thoại mới:", err);
                res.status(500).json({
                  message: "Lỗi khi thêm số điện thoại mới",
                  error: err.message,
                });
              });
          } else {
            res.json({ message: "Cinema đã được cập nhật thành công" });
          }
        }
      );
    }
  );
});

// API xóa Cinema
app.delete("/api/cinemas/:id", (req, res) => {
  const cinemaId = req.params.id;

  // Xóa số điện thoại trước
  db.query("DELETE FROM CINEMA_PHONE WHERE CinemaID = ?", [cinemaId], (err) => {
    if (err) {
      console.error("Lỗi khi xóa số điện thoại:", err);
      return res
        .status(500)
        .json({ message: "Lỗi khi xóa số điện thoại", error: err.message });
    }

    // Xóa Cinema
    const query = "DELETE FROM CINEMA WHERE CinemaID = ?";

    db.query(query, [cinemaId], (err, result) => {
      if (err) {
        console.error("Lỗi khi xóa Cinema:", err);
        return res
          .status(500)
          .json({ message: "Lỗi server", error: err.message });
      }
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy Cinema để xóa" });
      }
      res.json({ message: "Cinema đã được xóa thành công" });
    });
  });
});

// API thêm Showtime
const formatDateTimeForMySQL = (isoDateTime) => {
  const date = new Date(isoDateTime);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

app.post("/api/showtimes", (req, res) => {
  const { RoomID, MovieID, StartTime, Duration, Format, Subtitle, Dub } =
    req.body;

  if (!RoomID || !MovieID || !StartTime || !Duration || !Format) {
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
  }

  const formattedStartTime = formatDateTimeForMySQL(StartTime);

  const query = `
    INSERT INTO SHOWTIME (RoomID, MovieID, StartTime, Duration, Format, Subtitle, Dub)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      RoomID,
      MovieID,
      formattedStartTime,
      Duration,
      Format,
      Subtitle || false,
      Dub || false,
    ],
    (err) => {
      if (err) {
        console.error("Lỗi khi thêm Showtime:", err);
        return res
          .status(500)
          .json({ message: "Lỗi server", error: err.message });
      }
      res.status(201).json({ message: "Showtime đã được thêm thành công" });
    }
  );
});

// API cập nhật Showtime
app.put("/api/showtimes/:id", (req, res) => {
  const { RoomID, MovieID, StartTime, Duration, Format, Subtitle, Dub } =
    req.body;

  const query = `
    UPDATE SHOWTIME
    SET Duration = ?, Format = ?, Subtitle = ?, Dub = ?
    WHERE RoomID = ? AND MovieID = ? AND StartTime = ?
  `;

  db.query(
    query,
    [Duration, Format, Subtitle, Dub, RoomID, MovieID, StartTime],
    (err, result) => {
      if (err) {
        console.error("Lỗi khi cập nhật Showtime:", err);
        return res
          .status(500)
          .json({ message: "Lỗi server", error: err.message });
      }
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy Showtime để cập nhật" });
      }
      res.json({ message: "Showtime đã được cập nhật thành công" });
    }
  );
});

// API lấy danh sách Showtime
app.get("/api/showtimes", (req, res) => {
  const query = "SELECT * FROM SHOWTIME";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy danh sách Showtime:", err);
      return res
        .status(500)
        .json({ message: "Lỗi server", error: err.message });
    }
    res.json(results);
  });
});

// API lấy thông tin Showtime theo ID
app.get("/api/showtimes/:id", (req, res) => {
  const { RoomID, MovieID, StartTime } = req.query;
  const query =
    "SELECT * FROM SHOWTIME WHERE RoomID = ? AND MovieID = ? AND StartTime = ?";

  db.query(query, [RoomID, MovieID, StartTime], (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy thông tin Showtime:", err);
      return res
        .status(500)
        .json({ message: "Lỗi server", error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy Showtime" });
    }
    res.json(results[0]);
  });
});

// API xóa Showtime
app.delete("/api/showtimes/:id", (req, res) => {
  const { RoomID, MovieID, StartTime } = req.body;

  const query = `
    DELETE FROM SHOWTIME
    WHERE RoomID = ? AND MovieID = ? AND StartTime = ?
  `;

  db.query(query, [RoomID, MovieID, StartTime], (err, result) => {
    if (err) {
      console.error("Lỗi khi xóa Showtime:", err);
      return res
        .status(500)
        .json({ message: "Lỗi server", error: err.message });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy Showtime để xóa" });
    }
    res.json({ message: "Showtime đã được xóa thành công" });
  });
});

// API lấy Room
app.get("/api/rooms", (req, res) => {
  const { cinemaId } = req.query;

  let query = "SELECT * FROM ROOM";
  const queryParams = [];

  if (cinemaId) {
    query += " WHERE CinemaID = ?";
    queryParams.push(cinemaId);
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy danh sách Room:", err);
      return res
        .status(500)
        .json({ message: "Lỗi server", error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy Room nào" });
    }
    res.json(results);
  });
});

// API lấy danh sách khách hàng
app.get("/api/customers", (req, res) => {
  const query = `
    SELECT 
      CustomerID, 
      FullName, 
      DateOfBirth, 
      Email, 
      PhoneNumber, 
      MembershipLevel, 
      RegistrationDate, 
      TotalSpent, 
      TotalOrders 
    FROM CUSTOMER
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy danh sách khách hàng:", err);
      return res
        .status(500)
        .json({ message: "Lỗi server", error: err.message });
    }
    const formattedResults = results.map((customer) => ({
      ...customer,
      DateOfBirth: customer.DateOfBirth
        ? new Date(customer.DateOfBirth).toISOString()
        : null,
      RegistrationDate: customer.RegistrationDate
        ? new Date(customer.RegistrationDate).toISOString()
        : null,
    }));
    res.json(formattedResults);
  });
});

// API thêm khách hàng
app.post("/api/customers", (req, res) => {
  const { FullName, DateOfBirth, Email, PhoneNumber, MembershipLevel } =
    req.body;

  if (!FullName || !Email) {
    return res
      .status(400)
      .json({ message: "Thiếu thông tin bắt buộc: FullName, Email" });
  }

  const query = `
    INSERT INTO CUSTOMER (FullName, DateOfBirth, Email, PhoneNumber, MembershipLevel, RegistrationDate)
    VALUES (?, ?, ?, ?, ?, NOW())
  `;

  db.query(
    query,
    [
      FullName,
      DateOfBirth ? new Date(DateOfBirth) : null,
      Email,
      PhoneNumber || null,
      MembershipLevel || "Standard",
    ],
    (err, result) => {
      if (err) {
        console.error("Lỗi khi thêm khách hàng:", err);
        return res
          .status(500)
          .json({ message: "Lỗi server", error: err.message });
      }
      res.status(201).json({
        message: "Khách hàng đã được thêm thành công",
        customerId: result.insertId,
      });
    }
  );
});

// API cập nhật thông tin khách hàng
app.put("/api/customers/:id", (req, res) => {
  const customerId = req.params.id;
  const { FullName, DateOfBirth, Email, PhoneNumber, MembershipLevel } =
    req.body;

  if (!FullName || !Email) {
    return res
      .status(400)
      .json({ message: "Thiếu thông tin bắt buộc: FullName, Email" });
  }

  const query = `
    UPDATE CUSTOMER
    SET FullName = ?, DateOfBirth = ?, Email = ?, PhoneNumber = ?, MembershipLevel = ?
    WHERE CustomerID = ?
  `;

  db.query(
    query,
    [
      FullName,
      DateOfBirth ? new Date(DateOfBirth) : null,
      Email,
      PhoneNumber || null,
      MembershipLevel || "Standard",
      customerId,
    ],
    (err, result) => {
      if (err) {
        console.error("Lỗi khi cập nhật khách hàng:", err);
        return res
          .status(500)
          .json({ message: "Lỗi server", error: err.message });
      }
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy khách hàng để cập nhật" });
      }
      res.json({ message: "Khách hàng đã được cập nhật thành công" });
    }
  );
});

// API xóa khách hàng
app.delete("/api/customers/:id", (req, res) => {
  const customerId = req.params.id;

  // Kiểm tra xem khách hàng có đơn hàng liên quan không
  const checkOrdersQuery = `SELECT COUNT(*) as orderCount FROM \`ORDER\` WHERE CustomerID = ?`;
  db.query(checkOrdersQuery, [customerId], (err, results) => {
    if (err) {
      console.error("Lỗi khi kiểm tra đơn hàng:", err);
      return res
        .status(500)
        .json({ message: "Lỗi server", error: err.message });
    }
    if (results[0].orderCount > 0) {
      return res.status(400).json({
        message: "Không thể xóa khách hàng vì đã có đơn hàng liên quan",
      });
    }

    const deleteQuery = `DELETE FROM CUSTOMER WHERE CustomerID = ?`;
    db.query(deleteQuery, [customerId], (err, result) => {
      if (err) {
        console.error("Lỗi khi xóa khách hàng:", err);
        return res
          .status(500)
          .json({ message: "Lỗi server", error: err.message });
      }
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy khách hàng để xóa" });
      }
      res.json({ message: "Khách hàng đã được xóa thành công" });
    });
  });
});

// API lấy danh sách đơn hàng của khách hàng
app.get("/api/customers/:id/orders", (req, res) => {
  const customerId = req.params.id;

  const query = `
    SELECT 
      o.OrderID, 
      o.Date, 
      o.Time, 
      o.Status, 
      o.TotalPrice, 
      o.PaymentMethod, 
      o.isTicket, 
      o.isFood 
    FROM \`ORDER\` o
    WHERE o.CustomerID = ?
  `;

  db.query(query, [customerId], (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy danh sách đơn hàng của khách hàng:", err);
      return res
        .status(500)
        .json({ message: "Lỗi server", error: err.message });
    }
    const formattedResults = results.map((order) => {
      let orderTime = null;
      if (order.Date && order.Time) {
        const dateTimeString = `${order.Date} ${order.Time}`;
        const parsedDate = new Date(dateTimeString);
        if (!isNaN(parsedDate.getTime())) {
          orderTime = parsedDate.toISOString();
        }
      }
      return {
        ...order,
        orderTime,
      };
    });
    res.json(formattedResults);
  });
});

// Import routes
import voucherRoute from "./api/routes/voucher.route.js";
import orderRoute from "./api/routes/orders.route.js";

// Use routes
app.use("/api/vouchers", voucherRoute);
app.use("/api/orders", orderRoute);

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
