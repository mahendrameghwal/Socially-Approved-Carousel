import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import cookieParser from 'cookie-parser';
import errorHandler from './handlers/errorhandler';
import videoRouter from './routes/video.routes';

dotenv.config();

const app = express();

// ── Core Middleware ────────────────────────────────────────────────────────────
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── CORS ───────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5174',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        const msg = `CORS policy does not allow access from: ${origin}`;
        return callback(new Error(msg), false);
      }
    },
    credentials: true,
  })
);

app.options('*', cors());

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use('/api/v1/videos', videoRouter);

// ── Global Error Handler ───────────────────────────────────────────────────────
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

export { app };