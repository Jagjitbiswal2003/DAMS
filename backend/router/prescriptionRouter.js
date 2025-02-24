import express from "express";
import { addPrescription } from "../controller/prescriptionController.js";

const router = express.Router();

router.post("/prescription-success", addPrescription);

export default router;
