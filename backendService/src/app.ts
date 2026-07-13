import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";
import helmet from "helmet";
import cors from "cors";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Our TradieHub API is running" });
});
app.use("/api/v1", router);
app.use(errorMiddleware);

export default app;
