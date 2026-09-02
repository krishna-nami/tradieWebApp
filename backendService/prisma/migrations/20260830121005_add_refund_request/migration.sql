-- CreateEnum
CREATE TYPE "RefundRequestStatus" AS ENUM ('PENDING_APPROVAL', 'REJECT_BY_PARTY', 'PENDING_ADMIN', 'REJECT_BY_ADMIN', 'APPROVED', 'PROCESSED', 'FAILED');

-- CreateTable
CREATE TABLE "refund_requests" (
    "id" TEXT NOT NULL,
    "paymendId" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "requestedBy" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" "RefundRequestStatus" NOT NULL DEFAULT 'PENDING_APPROVAL',
    "partyRejectReason" TEXT,
    "adminApprovedBy" TEXT,
    "adminRejectReason" TEXT,
    "stripeRefundId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "refund_requests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "refund_requests" ADD CONSTRAINT "refund_requests_paymendId_fkey" FOREIGN KEY ("paymendId") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
