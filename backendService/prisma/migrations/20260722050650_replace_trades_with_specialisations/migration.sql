/*
  Warnings:

  - You are about to drop the column `trades` on the `profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "trades";

-- CreateTable
CREATE TABLE "TradieSpecialisation" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "trade" TEXT NOT NULL,
    "yearsExperience" INTEGER,
    "certification" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TradieSpecialisation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TradieSpecialisation_profileId_trade_key" ON "TradieSpecialisation"("profileId", "trade");

-- AddForeignKey
ALTER TABLE "TradieSpecialisation" ADD CONSTRAINT "TradieSpecialisation_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
