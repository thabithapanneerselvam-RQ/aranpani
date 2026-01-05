import { Router } from "express";
import {getMetrics, getDetails, getSubdetails, getOnetimepayments, getOtpSubdetails, sendOtp, createOtp} from "../Controllers/paymentControllers"

const router = Router()


router.get("/metrics", getMetrics)
router.get("/details", getDetails)
router.get("/:paymentId/sub-details", getSubdetails)

router.get("/onetimepayment", getOnetimepayments)
router.get("/oneTimePayment/:paymentId/sub-details", getOtpSubdetails)

router.post("/send-otp", sendOtp);
router.post("/create-otp", createOtp)


export default router;