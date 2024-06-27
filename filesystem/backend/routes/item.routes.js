import express from "express";
import {
  validateAccessToken,
  validateItem,
  verifyRoles,
} from "../middleware/index.middleware.js";
import { ROLES_LIST } from "../config/roles.config.js";

const itemRouter = ({ getItems, createItem, deleteItem, updateItem }) => {
  const router = express.Router();
  router
    .route("/")
    // .all(validateAccessToken)
    .get(getItems)
    .post(
      // validateAccessToken,
      // verifyRoles(ROLES_LIST.admin, ROLES_LIST.editor),
      validateItem,
      createItem
    );
  router
    .route("/:id")
    .put(validateItem, updateItem)
    .delete(
      // validateAccessToken,
      // verifyRoles(ROLES_LIST.admin),
      deleteItem
    );

  return router;
};

export default itemRouter;
