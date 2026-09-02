/*
  Warnings:

  - You are about to drop the column `paymendId` on the `refund_requests` table. All the data in the column will be lost.
  - Added the required column `paymentId` to the `refund_requests` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "refund_requests" DROP CONSTRAINT "refund_requests_paymendId_fkey";

-- AlterTable
ALTER TABLE "refund_requests" DROP COLUMN "paymendId",
ADD COLUMN     "paymentId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "refund_requests" ADD CONSTRAINT "refund_requests_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
