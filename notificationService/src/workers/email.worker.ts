import { Job, Worker } from "bullmq";
import { Resend } from "resend";
import { EMAIL_JOB_NAMES, QUEUE_NAMES } from "../config/queue.definations.js";
import { emailJobSchemas } from "../validators/email.validator.js";
import { emailTemplates } from "../templates/email-templates.js";
import { redisConnection } from "../config/redis.js";
import { ZodError } from "zod";

if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is not set");
if (!process.env.FROM_EMAIL) throw new Error("FROM_EMAIL is not set");

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL;
const EMAIL_OVERRIDE_TO = process.env.EMAIL_OVERIDE_TO;

async function processEmailJob(job: Job) {
  let content: { subject: string; html: string };
  let to: string;

  switch (job.name) {
    case EMAIL_JOB_NAMES.WELCOME: {
      const data = emailJobSchemas.WELCOME.parse(job.data);
      to = data.to;
      content = emailTemplates.welcome(data);
      break;
    }
    case EMAIL_JOB_NAMES.VERIFY_EMAIL: {
      const data = emailJobSchemas.VERIFY_EMAIL.parse(job.data);
      to = data.to;
      content = emailTemplates.verifyEmail(data);
      break;
    }
    case EMAIL_JOB_NAMES.PASSWORD_RESET: {
      const data = emailJobSchemas.PASSWORD_RESET.parse(job.data);
      to = data.to;
      content = emailTemplates.passwordReset(data);
      break;
    }
    case EMAIL_JOB_NAMES.BOOKING_REQUESTED: {
      const data = emailJobSchemas.BOOKING_REQUESTED.parse(job.data);
      to = data.to;
      content = emailTemplates.bookingRequested(data);
      break;
    }
    case EMAIL_JOB_NAMES.BOOKING_CONFIRMED: {
      const data = emailJobSchemas.BOOKING_CONFIRMED.parse(job.data);
      to = data.to;
      content = emailTemplates.bookingConfirmed(data);
      break;
    }
    case EMAIL_JOB_NAMES.BOOKING_COMPLETED: {
      const data = emailJobSchemas.BOOKING_COMPLETED.parse(job.data);
      to = data.to;
      content = emailTemplates.bookingCompleted(data);
      break;
    }
    case EMAIL_JOB_NAMES.PAYMENT_RECEIPT: {
      const data = emailJobSchemas.PAYMENT_RECEIPT.parse(job.data);
      to = data.to;
      content = emailTemplates.paymentReceipt(data);
      break;
    }

    default:
      console.warn(`unhandled email job type:${job.name}`);
      return;
  }
  const actualRecipient = to;
  const deliveredTo = EMAIL_OVERRIDE_TO || to;
  const subject = EMAIL_OVERRIDE_TO
    ? `[Test → ${actualRecipient}] ${content.subject}`
    : content.subject;

  const result = await resend.emails.send({
    from: FROM_EMAIL,
    to: deliveredTo,
    subject,
    html: content.html,
  });

  if (result.error) {
    throw new Error(`Resend error:${result.error.message}`);
  }
  console.info(
    `Email sent:${job.name} intended for  ${actualRecipient}, delivered to ${deliveredTo} (id:${result.data?.id})`,
  );
}

export const emailWorker = new Worker(QUEUE_NAMES.EMAIL, processEmailJob, {
  connection: redisConnection,
  concurrency: 5,
});

emailWorker.on("completed", (job) => {
  console.info(`Email job ${job.id} (${job.name}) completed`);
});
emailWorker.on("failed", (job, err) => {
  if (err instanceof ZodError) {
    console.log(
      `Email job ${job?.id} (${job?.name} has invalid data)`,
      err.issues,
    );
  } else {
    console.log(`Email job ${job?.id} (${job?.name}) failed:`, err.message);
  }
});
