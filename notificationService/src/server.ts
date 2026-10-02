// src/server.ts
import express from "express";
import dotenv from "dotenv";
import { emailWorker } from "./workers/email.worker.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5010;

app.get("/", (_req, res) => {
  res.json({ message: "TradieHub Notification Service is running" });
});

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    emailWorker: emailWorker.isRunning() ? "running" : "stopped",
  });
});

app.listen(PORT, () => {
  console.info(`Notification service running on http://localhost:${PORT}`);
});

// Graceful shutdown — important for BullMQ workers specifically, so
// in-flight jobs aren't abruptly killed mid-processing
process.on("SIGTERM", async () => {
  console.info("SIGTERM received, shutting down gracefully");
  await emailWorker.close();
  process.exit(0);
});
