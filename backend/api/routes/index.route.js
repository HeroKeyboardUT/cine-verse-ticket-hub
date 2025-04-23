import movieRoute from "./movies.route.js";
import cinemaRoute from "./cinema.route.js";
import userRoute from "./user.route.js";
import showtimeRoute from "./showtimes.route.js";
import seatRoute from "./seat.route.js";
// import orderRouter from "./orders.route.js";
// import foodRouter from "./food.route.js";
import authRouter from "./auth.route.js";
// import voucherRouter from "./voucher.route.js";

function routes(app) {
  // API Routes
  ///////////////////////////////////

  // API movieRoutes
  app.use("/api/movies", movieRoute);
  app.use("/api/cinemas", cinemaRoute);
  app.use("/api/customers", userRoute);
  app.use("/api/showtimes", showtimeRoute);
  app.use("/api/seats", seatRoute);
  // app.use("/api/orders", orderRouter);
  // app.use('/api/food', foodRouter);
  app.use('/api/auth', authRouter);
  // app.use('/api/voucher', voucherRouter);
}

export default routes;
