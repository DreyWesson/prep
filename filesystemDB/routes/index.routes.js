import express from "express";
import { swaggerSpec, swaggerUi } from "../docs/index.js";
import userRouter from "./user.routes.js";
import itemRouter from "./item.routes.js";
import otherRouter from "./others.routes.js";


export default function ({ itemController, homeController, userController }) {
  const router = express.Router();

  router.use("/", otherRouter(homeController))
  router.use("/items", itemRouter(itemController));
  router.use('/users', userRouter(userController));
  router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  return router;
}
