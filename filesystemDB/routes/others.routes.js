

import express from "express";
import { validateJWT } from "../middleware/index.middleware.js";

const otherRouter = ({ getHome }) => {
  const router = express.Router();

  router.route("/").get(validateJWT, getHome);

  return router;
};

export default otherRouter;
