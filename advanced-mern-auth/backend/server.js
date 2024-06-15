import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import privateRoutes from "./routes/private.routes.js";
import errorResponse from "./middleware/error.middleware.js";
import { shield } from "./middleware/auth.middleware.js";
import morgan from "morgan";

dotenv.config();
connectDB();
const app = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use("/api/auth", authRoutes);
app.use("/api/private", shield, privateRoutes);
// Error handler (should be last piece of middleware)
app.use(errorResponse);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`Listening on http://localhost:${PORT}`)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error: ${err}`);
  // server.close(() => process.exit(1));
});
