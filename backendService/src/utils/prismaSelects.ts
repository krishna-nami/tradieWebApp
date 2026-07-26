// utils/prismaSelects.ts

import { Prisma } from "../generated/prisma/index.js";

export const userSummarySelect = {
  id: true,
  email: true,
  profile: { select: { firstName: true, lastName: true } },
} satisfies Prisma.UserSelect;
