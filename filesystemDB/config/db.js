import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function connectDB(dbName) {
  return path.join(__dirname, dbName);
}
export const getDatabase = () => {
  const env = process.env.NODE_ENV;
  switch (env) {
    case "development":
      return process.env.DEV_DB_PATH;
    case "test":
        return process.env.TEST_DB_PATH;
    case "staging":
      return process.env.STAGING_DB_PATH;
    case "production":
      return process.env.PROD_DB_PATH;
    default:
      throw new Error("NODE_ENV is not set to a valid value");
  }
};
