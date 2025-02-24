import express from "express";
import { paymentSuccess } from "../controller/PaymentController.js";
const router = express.Router();

router.post("/payment-success", paymentSuccess);

export default router;
