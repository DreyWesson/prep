import express from "express";
import cors from "cors";
// import { swaggerSpec, swaggerUi } from "./docs/index.js";
import appRoutes from "./routes/app.routes.js";
import { corsOptions } from "./config/cors.config.js";
import { logger } from "./middleware/logger.middleware.js";
import { errorLogger } from "./middleware/error.middleware.js";
import { errorRoute } from "./routes/error.routes.js";

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

  // Routes
  app.use("/api/v1", appRoutes(database));
  app.use("*", errorRoute);

  // Error Middleware
  app.use(errorLogger);

  return app;
}
