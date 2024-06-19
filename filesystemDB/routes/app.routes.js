import express from "express";
import { validateItem, validateRegistration } from "../middleware/validator.middleware.js";
import { swaggerSpec, swaggerUi } from "../docs/index.js";
import { getUsers, registerUser } from "../controllers/fs/users.fs.controllers.js";

export default function ({ itemController, homeController }) {
  const router = express.Router();

  const { createItem, getItems, updateItem, deleteItem } = itemController;
  const { getHome } = homeController;

  router.route("/").get(getHome);

  router.route("/items").get(getItems).post(validateItem, createItem);
  router.route("/items/:id").put(validateItem, updateItem).delete(deleteItem);

  router.route("/users").get(getUsers);
  router.route("/users/register").post(validateRegistration, registerUser);

  router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  return router;
}
