


import mongoose from "mongoose";

// Define a schema
const disasterSchema = new mongoose.Schema({
  type: { type: String, required: [true, "Type is required"] },
  name: { type: String, required: [true, "Name is required"] },
  location: { type: String, required: [true, "Location is required"] },
  date: { type: Date, required: [true, "Date is required"] },
  severity: { type: String, required: [true, "Severity is required"] },
  status: { type: String, required: [true, "Status is required"] },
  details: { type: String, required: [true, "Details are required"] },
});

export const Disaster = mongoose.model('Disaster', disasterSchema);