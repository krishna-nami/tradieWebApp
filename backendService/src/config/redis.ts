import { Redis } from "ioredis";
if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not set");
}

export const redisConnection = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  family: 4,
});
redisConnection?.on("error", (err) => {
  console.error("Redis connection error:", err.message);
});
