/*
  Warnings:

  - You are about to drop the column `isAvailable` on the `jobs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "jobs" DROP COLUMN "isAvailable";

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true;
