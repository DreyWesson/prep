import express from 'express';

export default ({ homeController }) => {
  const router = express.Router();
  const { getHome } = homeController;

  router.get("/", (req, res) => getHome(req, res));

  return router;
};
