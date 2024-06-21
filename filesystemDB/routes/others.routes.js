import express from "express";

const otherRouter = ({ getHome }) => {
  const router = express.Router();

  router.route("/").get(getHome);

  return router;
};

export default otherRouter;
