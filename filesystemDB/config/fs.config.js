import path from "path";
import { fileURLToPath } from "url";
import { setToken } from "./token.config.js";
import { filterOtherUsers } from "../utils/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function connectFS(dbName) {
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

export const injectUserWithToken = (allUsers, user, username) => {
  try {
    const accessToken = setToken(user, process.env.ACCESS_TOKEN, "60s");
    const refreshToken = setToken(user, process.env.REFRESH_TOKEN, "1d");

    const otherUsers = filterOtherUsers(allUsers, username);
    const targetUser = { ...user, refreshToken };

    return {
      accessToken,
      refreshToken,
      tokenizedUser: [...otherUsers, targetUser],
    };
  } catch (error) {
    console.error("Error injecting user with token:", error);
    throw new Error("Token injection failed");
  }
};