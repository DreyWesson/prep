import express from "express";
import { connectFS, selectDatabase } from "../config/fs.config.js";

export default function ({ itemController }) {
  const router = express.Router();
  // const filePath = connectFS(selectDatabase());
  const { createItem, getItems, updateItem, deleteItem } = itemController;

  router.post("/items", createItem);
  router.get("/items", getItems);
  router.put("/items/:id", updateItem);
  router.delete("/items/:id", deleteItem);

  return router;
}
