import express from 'express';
import { getHome } from '../controllers/home.controllers.js';

export default () => {
  const router = express.Router();

  router.get("/", (req, res) => getHome(req, res));

  return router;
};
