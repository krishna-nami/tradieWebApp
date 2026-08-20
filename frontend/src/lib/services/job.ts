// lib/services/job.ts
import api from "@/lib/api";
import type { ApiResponse, Job } from "@/lib/api-types";

interface CreateJobPayload {
  title: string;
  description: string;
  category: string;
  suburb: string;
  state: string;
  postcode: string;
  budgetMax?: number;
  scheduledAt?: string;
  tradieId: string;
}

export const createJob = (payload: CreateJobPayload) =>
  api.post<ApiResponse<Job>>("/job/createJob", payload).then((res) => res.data);
