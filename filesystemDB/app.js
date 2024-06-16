import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import itemRoutes from "./routes/items.routes.js";
import { connectDB } from "./config/db.js";
import { swaggerSpec, swaggerUi } from "./docs/index.js";
import homeRoutes from "./routes/home.routes.js";

// Create Express App
const app = express();

// Load environment variables
dotenv.config();

// Connect Database
const filePath = connectDB("../db/data.json");
const filePathTests = connectDB("../db/testDB.json");

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/", homeRoutes());
app.use("/api/v1", itemRoutes(filePath));
app.use("/tests/", itemRoutes(filePathTests));

// Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
