/*
  Warnings:

  - The values [REJECT_BY_PARTY,REJECT_BY_ADMIN] on the enum `RefundRequestStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RefundRequestStatus_new" AS ENUM ('PENDING_APPROVAL', 'REJECTED_BY_PARTY', 'PENDING_ADMIN', 'REJECTED_BY_ADMIN', 'APPROVED', 'PROCESSED', 'FAILED');
ALTER TABLE "public"."refund_requests" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "refund_requests" ALTER COLUMN "status" TYPE "RefundRequestStatus_new" USING ("status"::text::"RefundRequestStatus_new");
ALTER TYPE "RefundRequestStatus" RENAME TO "RefundRequestStatus_old";
ALTER TYPE "RefundRequestStatus_new" RENAME TO "RefundRequestStatus";
DROP TYPE "public"."RefundRequestStatus_old";
ALTER TABLE "refund_requests" ALTER COLUMN "status" SET DEFAULT 'PENDING_APPROVAL';
COMMIT;

-- CreateTable
CREATE TABLE "payout_records" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "tradieId" TEXT NOT NULL,
    "stripeTransferId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SUCCEEDED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payout_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payout_records_bookingId_key" ON "payout_records"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "payout_records_stripeTransferId_key" ON "payout_records"("stripeTransferId");

-- AddForeignKey
ALTER TABLE "payout_records" ADD CONSTRAINT "payout_records_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payout_records" ADD CONSTRAINT "payout_records_tradieId_fkey" FOREIGN KEY ("tradieId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
