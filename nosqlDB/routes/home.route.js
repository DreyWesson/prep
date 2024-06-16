import { getHome } from "../controller/home.controller.js";
import express from "express";

export const homeRouter = () => {
  const router = express.Router();

  router.get("/", (req, res) => getHome(req, res));

  return router;
};
