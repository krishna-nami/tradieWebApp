import { ZodType } from "zod";
import { ApiError } from "./ApiError.js";

export const validateRequest = <T>(
  schema: ZodType<{ body: T }>,
  body: unknown,
): T => {
  const result = schema.safeParse({ body });
  if (!result.success) {
    const fieldErrors = result.error.issues.map((issue) => ({
      field: issue.path.slice(1).join("."),
      message: issue.message,
    }));
    throw new ApiError(
      400,
      result.error.issues[0]?.message ?? "Validation failed",
      fieldErrors,
    );
  }
  return result.data.body;
};
