import dotenv from "dotenv";
import mongoose from "mongoose";
import createServer from "./app.js";
import { connectNOSQL } from "./config/nosql.config.js";
import { selectDB } from "./config/index.config.js";
import { query } from "./config/sql.config.js";

dotenv.config();

const PORT = process.env.PORT || 80;

connectNOSQL();
mongoose.connection.on("connected", () => console.log("Connected to MongoDB"));

const database = selectDB("nosql");


createServer(database).listen(PORT, () =>
  console.log(`Server is running on port ${PORT}`)
);

process.on("unhandledRejection", (error, promise) => {
  console.log(`Error: ${error.message}`);
  server.close(() => process.exit(1));
});
