import express from "express";
import { body } from "express-validator";

import isAuth from "../middleware/isAuth.js";
import { signup, login, logout, getUser, updateUser, getResetToken, resetPassword, activateAccount, googleAuth, googleOAuthCallback, unsubscribe, deleteUser, activateTwoFactor } from "../controllers/users.js";
import bodyParser from "body-parser";

const router = express.Router();

const emailValidator = body("email")
  .isEmail()
  .normalizeEmail()
  .withMessage("Email Address is not valid.");
const passwordValidator = body("password")
  .trim()
  .isLength({ min: 6 })
  .withMessage("Password has to be 6 chars or more.");
const nameValidator = body("name")
  .trim()
  .notEmpty()
  .withMessage("Name is required.");

// POST /users/signup
router.post(
  "/signup",
  bodyParser.urlencoded(),
  [emailValidator, passwordValidator, nameValidator],
  signup
);

// POST /users/login
router.post(
  "/login",
  bodyParser.urlencoded(),
  [emailValidator, passwordValidator],
  login
);

// POST /users/logout
router.post("/logout", isAuth, logout);

// GET /users/account
router.get("/account", isAuth, getUser);

// PUT /users/account
router.put("/account", isAuth, updateUser);

// POST /users/resetToken
router.post("/resetToken", [emailValidator], getResetToken);

// POST /users/resetPassword
router.post(
  "/resetPassword",
  [passwordValidator],
  resetPassword
);

// POST /users/activate
router.get("/activate/:token", activateAccount);

// Google OAuth
router.get("/google", googleAuth);

// Google OAuth Callback
router.get("/googleCallback", googleOAuthCallback);

// Unsubscribe from emails
router.get("/unsubscribe/:email", unsubscribe);

// POST /users/delete
router.post("/delete", isAuth, deleteUser);

// POST /users/activateTwoFactor
router.post("/activateTwoFactor", isAuth, activateTwoFactor);

export default router;