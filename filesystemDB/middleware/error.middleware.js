import { logEvents } from "./logger.middleware.js";

export const errorLogger = (err, req, res, next) => {
  logEvents(`${err.name}: ${err.message}`, "errors", req.randomUUID);
  res.status(500).json({ message: err.message, error: "Internal Server Error"});
};
