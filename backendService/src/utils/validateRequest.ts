import { z, ZodType } from "zod";
import { ApiError } from "./ApiError.js";

export const validateRequest = <T extends ZodType>(
  schema: T,
  data: unknown,
): z.infer<T> => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const fieldErrors = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    throw new ApiError(
      400,
      result.error.issues[0]?.message ?? "Validation failed",
      fieldErrors,
    );
  }
  return result.data;
};
