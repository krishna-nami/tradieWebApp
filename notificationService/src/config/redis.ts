import { Redis } from "ioredis";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not set yet");
}

export const redisConnection = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  family: 4,
});

redisConnection.on("connect", () => {
  console.info("Connected to Redis (Upstash");
});
redisConnection.on("error", (err) => {
  console.error("Redis connection error:", err);
});
