import express from "express";
import {
  validateRegistration,
  validateJWT,
} from "../middleware/index.middleware.js";

const userRouter = ({
  deleteUser,
  loginUser,
  getUsers,
  logoutUser,
  registerUser,
  handleRefreshToken,
}) => {
  const router = express.Router();

  router.route("/").get(validateJWT, getUsers).delete(deleteUser);
  router.route("/login").post(loginUser);
  router.route("/logout").get(logoutUser);
  router.route("/register").post(validateRegistration, registerUser);
  router.route("/refresh-token").get(handleRefreshToken);

  return router;
};

export default userRouter;
