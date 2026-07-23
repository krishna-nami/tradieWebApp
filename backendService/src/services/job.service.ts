import { prisma } from "../config/db.js";
import { CreateJobInput } from "../validators/job.validator.js";

export const createJobService = async (
  data: CreateJobInput,
  customerId: string,
) => {
  const job = await prisma.job.create({
    data: {
      customerId,
      title: data.title,
      description: data.description,
      category: data.category,
      suburb: data.suburb,
      state: data.state,
      postcode: data.postcode,
      budgetMin: data.budgetMin ?? null,
      budgetMax: data.budgetMax ?? null,
      scheduledAt: data.scheduledAt ?? null,
      status: "DRAFT",
    },
  });
  return job;
};
