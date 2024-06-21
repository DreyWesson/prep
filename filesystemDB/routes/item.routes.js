import express from "express";
import { validateItem } from "../middleware/index.middleware.js";

const itemRouter = ({ getItems, createItem, deleteItem, updateItem }) => {
  const router = express.Router();
  router
    .route("/")
    // .all(validateAccessToken)
    .get(getItems)
    .post(validateItem, createItem);
  router.route("/:id").put(validateItem, updateItem).delete(deleteItem);

  return router;
};

export default itemRouter;
