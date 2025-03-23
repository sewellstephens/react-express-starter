import express from "express";

import isAuth from "../middleware/isAuth.js";
import { getUsers, deleteUser, isAdmin, impersonateUser, stopImpersonatingUser, getUserCount, getAdminStats, resetUserUsage } from "../controllers/admin.js";

const router = express.Router();

router.get("/users", isAuth, getUsers);
router.delete("/deleteUser/:userEmail", isAuth, deleteUser);
router.get("/isAdmin", isAuth, isAdmin);
router.post("/impersonate/:userEmail", isAuth, impersonateUser);
router.post("/stopImpersonating", isAuth, stopImpersonatingUser);
router.get("/getUserCount", isAuth, getUserCount);
router.get("/getAdminStats", isAuth, getAdminStats);
router.post("/resetUserUsage/:userId", isAuth, resetUserUsage);

export default router;
