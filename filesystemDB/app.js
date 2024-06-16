import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import itemRoutes from "./routes/items.routes.js";
import { connectDB } from "./config/db.js";
import { swaggerSpec, swaggerUi } from "./docs/index.js";

// Load environment variables
dotenv.config();

// Create Express App
const app = express();

// Connect Database
const filePath = connectDB("../db/data.json");
const filePathTests = connectDB("../db/testDB.json");

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => res.json({ message: "API is live..." }));
app.use("/api/v1", itemRoutes(filePath));
app.use("/tests/", itemRoutes(filePathTests));

// Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


export default app;