import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import appRoutes from "./routes/index.routes.js";
import { corsOptions } from "./config/cors.config.js";
import { logger, errorLogger, credentials } from "./middleware/index.middleware.js";

export default function createServer(database) {
  if (!database)
    throw new Error("Pls, Connect a database...");

  const app = express();

  const { errorLoggerTestRoute, errorRoute } = database.otherControllers;
  // Middleware
  app.use(logger);
  app.use(express.json());
  app.use(credentials) // must use this middleware before cors
  app.use(cors(corsOptions));
  app.use(cookieParser());

  // Routes
  app.use("/api/v1", appRoutes(database));
  app.get("/error", errorLoggerTestRoute);
  app.use("*", errorRoute);

  // Error Logs Middleware
  app.use(errorLogger);

  return app;
}
