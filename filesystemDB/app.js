import express from "express";
import cors from "cors";
import itemRoutes from "./routes/items.routes.js";
import { swaggerSpec, swaggerUi } from "./docs/index.js";
import homeRoutes from "./routes/home.routes.js";
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
  app.use("/", homeRoutes(database));
  app.use("/api/v1", itemRoutes(database));

  // Documentation
  app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use("*", errorRoute);
  app.use(errorLogger);

  return app;
}
