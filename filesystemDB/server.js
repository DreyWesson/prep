import dotenv from "dotenv";
import mongoose from "mongoose";
import createServer from "./app.js";
import { connectNOSQL, mongooseStatus } from "./config/nosql.config.js";
import { selectDB } from "./config/index.config.js";

dotenv.config();

const PORT = process.env.PORT || 80;
const db_type = "sql";

if (db_type === "nosql") {
  connectNOSQL();
  mongooseStatus(mongoose);
}

const database = selectDB(db_type);

createServer(database).listen(PORT, () =>
  console.log(`Server is running on port ${PORT}`)
);

process.on("unhandledRejection", (error, promise) => {
  console.log(`Error: ${error.message}`);
  server.close(() => process.exit(1));
});
