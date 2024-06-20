import express from "express";
import cors from "cors";
import appRoutes from "./routes/app.routes.js";
import { corsOptions } from "./config/cors.config.js";
import { logger } from "./middleware/logger.middleware.js";
import { errorLogger } from "./middleware/error.middleware.js";
import { errorRoute } from "./routes/error.routes.js";
import cookieParser from "cookie-parser";

export default function injectApp(database) {
  if (!database) {
    throw new Error("Connect database...");
  }
  // Create Express App
  const app = express();

  // Middleware
  app.use(logger);
  app.use(express.json());
  app.use(cors(corsOptions));
  app.use(cookieParser());
  // Routes
  app.use("/api/v1", appRoutes(database));
    app.get("/error", (req, res, next) => {
      try {
        throw new Error("Deliberate error: testing error middleware");
      } catch (error) {
        next(error);
      }
    });
  app.use("*", errorRoute);


  // Error Middleware
  app.use(errorLogger);

  return app;
}
