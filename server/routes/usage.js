import express from "express";
import isAuth from "../middleware/isAuth.js";

import { getAiUsage, getPlan } from "../controllers/usage.js";

const router = express.Router();

router.get("/getUsage", isAuth, getAiUsage);
router.get("/getPlan", isAuth, getPlan);

export default router;
