import jwt from "jsonwebtoken";
import { allowedOrigins } from "../config/cors.config.js";

export const validateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }
    req.user = decoded;
    next();
  });
};

export const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) !== -1) {
    res.header("Access-Control-Allow-Origin", true);
    // you can use this middleware to determine allowed methods
    // res.header("Access-Control-Allow-Headers", "Authorization");
    // res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    // res.header("Access-Control-Allow-Credentials", "true");
  }
  next();
};