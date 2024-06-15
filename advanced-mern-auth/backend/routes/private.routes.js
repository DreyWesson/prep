import express from "express";
import { getPrivateData } from "../controllers/private.controller.js";
const router = express.Router();

router.get("/", getPrivateData);

export default router;
