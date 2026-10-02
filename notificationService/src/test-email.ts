import { Queue } from "bullmq";
import dotenv from "dotenv";
import { EMAIL_JOB_NAMES, QUEUE_NAMES } from "./config/queue.definations.js";
import { redisConnection } from "./config/redis.js";

dotenv.config();

const emailQueue = new Queue(QUEUE_NAMES.EMAIL, {
  connection: redisConnection,
});

async function main() {
  await emailQueue.add(EMAIL_JOB_NAMES.WELCOME, {
    to: "hello.tradiehub@gmail.com",
    firstName: "Krishna",
  });

  console.info("Test job added to queue");
  process.exit(0);
}

main();
