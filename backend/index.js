import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './api/routes/index.route.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

// Load .env
dotenv.config();

const app = express();
const port = process.env.PORT || 5000; // fallback 

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// Routing
routes(app);

//Listening
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});