import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function connectDB(dbName) {
  return path.join(__dirname, dbName);
}
export const selectDatabase = () => {
  const env = process.env.NODE_ENV;
  const path = {
    development: process.env.DEV_DB_PATH,
    test: process.env.TEST_DB_PATH,
    staging: process.env.STAGING_DB_PATH,
    production: process.env.PROD_DB_PATH,
  }

  return path[env] || path.development;
};
