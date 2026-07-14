-- AlterTable
ALTER TABLE "users" ADD COLUMN     "passwordResetExpiry" TIMESTAMP(3),
ADD COLUMN     "passwordResettoken" TEXT;
