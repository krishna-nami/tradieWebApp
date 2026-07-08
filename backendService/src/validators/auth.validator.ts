import { z } from "zod";

export const registerSchema = z.object({
  body: z
    .object({
      email: z.email({ error: "Invalid email Address" }).toLowerCase().trim(),

      password: z
        .string({ error: "Password is required" })
        .min(8, { error: "Password must be atleast 8 charactors" })
        .max(64, { error: "Password must be less than 64 charactors" })
        .regex(/[A-Z]/, {
          error: "Password must contain at least one upper letter",
        })
        .regex(/[a-z]/, {
          error: "Password must have at least one lower letters",
        })
        .regex(/[0-9]/, { error: "Password must contain atleast one number" }),

      confirmPassword: z.string({ error: "Please confirm your passoword" }),
      role: z.enum(["CUSTOMER", "TRADIE"], {
        error: "Role must be eiter customer or traide",
      }),
      firstName: z
        .string({ error: "First name is required" })
        .min(2, { error: "First name must have 2 charactors" })
        .max(50, { error: "First name must have less than 50 charactors" })
        .trim(),

      lastName: z
        .string({ error: "Last name is required" })
        .min(2, { error: "Last name must have 2 charactors" })
        .max(50, { error: "Last name must have less than 50 charactors" })
        .trim(),
      phone: z
        .string()
        .regex(/^(\+61|0)[2-9]\d{8}$|^(\+61|0)4\d{8}$/, {
          error: "invalid Australian Phone Number ",
        })
        .optional(),
      abn: z
        .string()
        .regex(/^\d{11}$/, { error: "ABN must be exactly 11 digit" })
        .optional(),
      licenceNo: z
        .string()
        .max(50, { error: "Licesne number too long" })
        .optional(),

      addressLine1: z
        .string()
        .max(100, { error: "Address too long" })
        .optional(),

      addressLine2: z
        .string()
        .max(100, { error: "Address line 2 too long" })
        .optional(),

      suburb: z.string().max(50, { error: "Suburb too long" }).optional(),

      state: z
        .enum(["ACT", "NSW", "VIC", "QLD", "SA", "WA", "TAS", "NT"], {
          error: "Invalid Australian state",
        })
        .optional(),

      postcode: z
        .string()
        .regex(/^\d{4}$/, { error: "Postcode must be 4 digits" })
        .optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      error: "Passwords do not match",
      path: ["confirmPassword"],
    })
    .refine(
      (data) => {
        if (data.role === "TRADIE") {
          return !!data.abn;
        }
        return true;
      },
      {
        error: "ABN is required for tradie registration",
        path: ["abn"],
      },
    ),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email({ error: "Invalid email address" }).toLowerCase().trim(),

    password: z.string({ error: "Password is required" }),
  }),
});

//refresh token
export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string({ error: "Refresh token is required" }),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];
export type RefereshTokenIput = z.infer<typeof refreshTokenSchema>["body"];
