import { Router } from "express";
import {getMetrics, getDetails, getSubdetails, getOnetimepayments, getOtpSubdetails, sendOtp, createOtp, getDonorByPhone} from "../Controllers/paymentControllers"

const router = Router()


router.get("/metrics", getMetrics)
router.get("/details", getDetails)
router.get("/:paymentId/sub-details", getSubdetails)

router.get("/one-time-payment", getOnetimepayments)
router.get("/one-time-payment/:paymentId/sub-details", getOtpSubdetails)

router.post("/send-otp", sendOtp);
router.post("/create-otp", createOtp)

router.get("/donors/by-phone/:phoneNo", getDonorByPhone);

export default router;