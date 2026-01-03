import { Router } from "express";
import {getMetrics, getDetails, getSubdetails, getOnetimepayments, getOtpSubdetails} from "../Controllers/paymentControllers"

const router = Router()


router.get("/metrics", getMetrics)
router.get("/details", getDetails)
router.get("/:paymentId/sub-details", getSubdetails)

router.get("/onetimepayment", getOnetimepayments)
router.get("/oneTimePayment/:paymentId/sub-details", getOtpSubdetails)


export default router;