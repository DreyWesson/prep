import express from "express";
import { connectDB, selectDatabase } from "../config/fs.config.js";

export default function ({ itemController }) {
  const router = express.Router();
  const filePath = connectDB(selectDatabase());
  const { createItem, getItems, updateItem, deleteItem } = itemController;

  router.post("/items", (req, res) => createItem(req, res, filePath));
  router.get("/items", (req, res) => getItems(req, res, filePath));
  router.put("/items/:id", (req, res) => updateItem(req, res, filePath));
  router.delete("/items/:id", (req, res) => deleteItem(req, res, filePath));

  return router;
}
