import movieRouter from './movies.route.js'
import showtimeRouter from './showtimes.route.js'
import orderRouter from './orders.route.js'
import foodRouter from './food.route.js'
import authRouter from './auth.route.js'
import voucherRouter from './voucher.route.js'

function routes(app) {
    app.use('/api/movies', movieRouter);
    app.use('/api/showtimes', showtimeRouter);
    app.use('/api/orders', orderRouter);
    app.use('/api/food', foodRouter);
    app.use('/api/auth', authRouter);
    app.use('/api/voucher', voucherRouter);
} 

export default routes;