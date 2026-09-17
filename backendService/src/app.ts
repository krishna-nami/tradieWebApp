import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";
import helmet from "helmet";
import cors from "cors";
import { errorMiddleware } from "./middleware/error.middleware.js";
import webhookRoutes from "./routes/webhook.routes.js";

const app = express();
app.use(helmet());
const allowedOrigins = [
  "http://localhost:3000",
  "https://gettradiehub.com",
  "https://www.gettradiehub.com",
  "https://tradie-app-eight.vercel.app", // your Vercel default subdomain — keep for testing
];

app.use(
  cors({
    origin: (origin, callback) => {
      // origin is undefined for same-origin/non-browser requests (e.g. curl, Postman) — allow those
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use("/api/v1/webhook", webhookRoutes);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "Our TradieHub API is running now in server successfully",
  });
});
app.use("/api/v1", router);
app.use(errorMiddleware);

export default app;
