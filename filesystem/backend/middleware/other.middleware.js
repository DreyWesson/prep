import { allowedOrigins } from "../config/cors.config.js";

export const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) !== -1) {
    res.header("Access-Control-Allow-Origin", true);
  }
  next();
};

export const allowedMethods =
  (...httpMethods) =>
  (req, res, next) => {
    const allow = [...httpMethods];

    if (!allow.includes(req.method)) {
      return res
        .status(405)
        .json({ message: `Method ${req.method} not allowed` });
    }

    next();
  };
