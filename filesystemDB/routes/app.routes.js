import express from "express";
import {
  validateItem,
  validateRegistration,
} from "../middleware/validator.middleware.js";
import { swaggerSpec, swaggerUi } from "../docs/index.js";
import {
  deleteUser,
  getUsers,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/fs/users.fs.controllers.js";
import { validateJWT } from "../middleware/jwt.middleware.js";
import { handleRefreshToken } from "../controllers/fs/token.controller.js";

export default function ({ itemController, homeController }) {
  const router = express.Router();

  const { createItem, getItems, updateItem, deleteItem } = itemController;
  const { getHome } = homeController;

  router.route("/").get(validateJWT, getHome);

  router.route("/items").get(getItems).post(validateItem, createItem);
  router.route("/items/:id").put(validateItem, updateItem).delete(deleteItem);

  router.route("/users").get(validateJWT, getUsers);
  router.route("/users").delete(deleteUser); // future feature: validateJWT
  router.route("/users/login").post(loginUser);
  router.route("/users/logout").get(logoutUser);
  router.route("/users/register").post(validateRegistration, registerUser);
  router.route("/users/refresh-token").get(handleRefreshToken);

  router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  return router;
}
