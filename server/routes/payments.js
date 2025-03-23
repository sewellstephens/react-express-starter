import express from "express";
import bodyParser from "body-parser";

import { createCheckoutSession, createBillingPortal } from "../controllers/payments.js";
import isAuth from "../middleware/isAuth.js";

const router = express.Router();

router.post("/create", bodyParser.urlencoded(), createCheckoutSession);
router.post("/portal", isAuth, bodyParser.urlencoded(), createBillingPortal);

export default router;