import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
  doctorName: { type: String, required: true },
  patientName: { type: String, required: true },
  patientEmail: { type: String, required: true },
  meetingMode: { type: String, default: "online" }, 
  disease: { type: String, required: true },
  cause: { type: String, required: true },
  medicine: { type: String, required: true },
  meetingDate: { type: Date, required: true },
});

export const Prescription = mongoose.model("Prescription", prescriptionSchema);
