import express from "express";
import { connectDB, getDatabase } from "../config/db.js";
// import {
//   createItem,
//   getItems,
//   updateItem,
//   deleteItem,
// } from "../controllers/item.controllers.js";

export default function (database) {
  const router = express.Router();
  const {createItem, getItems, updateItem, deleteItem} = database;
  const filePath = connectDB(getDatabase());

  router.post("/items", (req, res) => createItem(req, res, filePath));
  router.get("/items", (req, res) => getItems(req, res, filePath));
  router.put("/items/:id", (req, res) => updateItem(req, res, filePath));
  router.delete("/items/:id", (req, res) => deleteItem(req, res, filePath));

  return router;
}
