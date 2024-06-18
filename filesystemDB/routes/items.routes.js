import express from "express";
import { connectFS, selectDatabase } from "../config/fs.config.js";
import { validateItem } from "../middleware/validator.middleware.js";

export default function ({ itemController }) {
  const router = express.Router();
  // const filePath = connectFS(selectDatabase());
  const { createItem, getItems, updateItem, deleteItem } = itemController;

  router.post("/items",validateItem, createItem);
  router.get("/items", getItems);
  router.put("/items/:id", validateItem, updateItem);
  router.delete("/items/:id", deleteItem);

  return router;
}
