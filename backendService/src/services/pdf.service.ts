import PDFDocument from "pdfkit";
import { prisma } from "../config/db.js";
import { userSummarySelect } from "../utils/prismaSelects.js";
import { ApiError } from "../utils/ApiError.js";

export const generateInvoicePdf = async (
  boookingId: string,
  requesterId: string,
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: boookingId },
    include: {
      job: {
        select: { title: true, suburb: true, state: true, postcode: true },
      },
      customer: { select: userSummarySelect },
      tradie: { select: userSummarySelect },
      quote: { include: { lineItems: true } },
      payment: true,
    },
  });
  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  const isOwner =
    booking.customerId === requesterId || booking.tradieId === requesterId;

  if (!isOwner) {
    throw new ApiError(403, "You do nto have permession to view this invoice");
  }

  if (!booking.quote) {
    throw new ApiError(400, "This booking has bo quote to invoice");
  }
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const chunks: Buffer[] = [];
  doc.on("data", (chunk: Buffer) => chunks.push(chunk));

  const donePromise = new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
  });

  //header
  doc
    .fontSize(20)
    .text("TradieHub", { continued: true })
    .fillColor("#F59E0B")
    .text(" Invoice");
  doc.fillColor("#000000").fontSize(10).moveDown(0.5);
  doc.text(`Invoice for booking #${booking.id.slice(0, 8).toUpperCase()}`);
  doc.text(`Date: ${new Date().toLocaleDateString("en-AU")}`);
  doc.moveDown();

  //parties
  doc.fontSize(12).text("Billed to:", { underline: true });
  doc
    .fontSize(10)
    .text(
      `${booking.customer.profile?.firstName} ${booking.customer.profile?.lastName}`,
    );
  doc.text(booking.customer.email);
  doc.moveDown(0.5);
  doc.fontSize(12).text("Tradie:", { underline: true });
  doc
    .fontSize(10)
    .text(
      `${booking.tradie.profile?.firstName} ${booking.tradie.profile?.lastName}`,
    );
  doc.text(booking.tradie.email);
  doc.moveDown();
  doc.fontSize(12).text("Job:", { underline: true });
  doc.fontSize(10).text(booking.job.title);
  doc.text(
    `${booking.job.suburb}, ${booking.job.state} ${booking.job.postcode}`,
  );
  doc.moveDown();

  // Line items table
  doc.fontSize(12).text("Line items:", { underline: true });
  doc.moveDown(0.3);

  const tableTop = doc.y;
  doc.fontSize(9).font("Helvetica-Bold");
  doc.text("Description", 50, tableTop, { width: 220 });
  doc.text("Qty", 270, tableTop, { width: 50 });
  doc.text("Unit price", 320, tableTop, { width: 80 });
  doc.text("Amount", 420, tableTop, { width: 80 });
  doc.moveDown(0.5);
  doc.font("Helvetica");

  booking.quote.lineItems.forEach((item) => {
    const y = doc.y;
    doc.fontSize(9).text(item.description, 50, y, { width: 220 });
    doc.text(String(item.quantity), 270, y, { width: 50 });
    doc.text(`$${Number(item.unitPrice).toFixed(2)}`, 320, y, { width: 80 });
    doc.text(`$${Number(item.amount).toFixed(2)}`, 420, y, { width: 80 });
    doc.moveDown(0.6);
  });
  doc.moveDown();
  doc.moveTo(320, doc.y).lineTo(500, doc.y).strokeColor("#cccccc").stroke();
  doc.moveDown(0.5);

  doc.fontSize(10);
  doc.text(
    `Subtotal: $${Number(booking.quote.subtotal).toFixed(2)}`,
    320,
    doc.y,
    { width: 180, align: "right" },
  );
  doc.text(`GST (10%): $${Number(booking.quote.gst).toFixed(2)}`, 320, doc.y, {
    width: 180,
    align: "right",
  });
  doc.fontSize(12).font("Helvetica-Bold");
  doc.text(`Total: $${Number(booking.quote.total).toFixed(2)}`, 320, doc.y, {
    width: 180,
    align: "right",
  });

  doc.moveDown(2);
  doc.fontSize(9).font("Helvetica").fillColor("#666666");
  doc.text(
    booking.payment?.status === "SUCCEEDED"
      ? "Payment status: PAID"
      : `Payment status: ${booking.payment?.status ?? "NOT PAID"}`,
  );

  doc.end();
  return donePromise;
};
