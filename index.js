import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

const COOKIE_SECRET = process.env.COOKIE_SECRET;
if (!COOKIE_SECRET) {
  throw new Error(
    "COOKIE_SECRET environment variable is required for signed cookies"
  );
}

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

import "./src/models/user.mjs";
import "./src/models/session.mjs";
import "./src/models/parking.mjs";
import "./src/models/booking.mjs";

import authRouter from "./src/routers/auth.mjs";
import userRouter from "./src/routers/user.mjs";
import fileRouter from "./src/routers/files.mjs";
import parkingRouter from "./src/routers/parkings.mjs";
import bookingRouter from "./src/routers/bookings.mjs";

const app = express();
const PORT = 3000;

const corsOptions = {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser(COOKIE_SECRET));

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api", fileRouter);
app.use("/api/parkings", parkingRouter);
app.use("/api/bookings", bookingRouter);

app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);
