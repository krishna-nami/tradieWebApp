import { haversineKm } from "./geo.js";
export const caclulateTravelFee = (
  tradieLat: number,
  tradieLng: number,
  jobLat: number,
  jobLng: number,
  ratePerKm: number,
) => {
  const distanceKm = haversineKm(tradieLat, tradieLng, jobLat, jobLng);
  const travelFee = Math.round(distanceKm * ratePerKm * 100) / 100;

  return {
    distanceKm: Math.round(distanceKm * 10) / 10,
    travelFee,
  };
};

//GST Calculation

export const GST_RATE = 0.1;

export const calculateGstFee = (subtotal: number) => {
  const gst = Math.round(subtotal * GST_RATE * 100) / 100;
  const total = Math.round((subtotal + gst) * 100) / 100;
  return { gst, total };
};
