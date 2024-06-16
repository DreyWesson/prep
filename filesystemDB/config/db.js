import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function connectDB(dbName) {
    return path.join(__dirname, dbName);
}
export const database = "../db/data.json";
export const testDatabase = "../db/testDB.json";