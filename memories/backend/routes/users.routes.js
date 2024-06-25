import express from "express";
import {
  forgotPassword,
  signin,
  signup,
  resetPassword,
} from "../controllers/users.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resetToken", resetPassword);

export default router;
