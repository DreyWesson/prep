import express from "express";
import {
  forgotPsw,
  login,
  register,
  resetPsw,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgotpassword", forgotPsw);
router.put("/resetpassword/:resetToken", resetPsw);

export default router;
