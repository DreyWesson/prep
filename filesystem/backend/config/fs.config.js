import path from "path";
import { fileURLToPath } from "url";
import { signToken } from "./token.config.js";

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
  };

  return path[env] || path.development;
};

export const injectToken = (user) => {
  try {
    const { ACCESS_TOKEN, REFRESH_TOKEN } = process.env;
    const accessToken = signToken(user, ACCESS_TOKEN, "2400s");
    const refreshToken = signToken(user, REFRESH_TOKEN, "1d");
    const tokenizedUser = { ...user, refreshToken };

    return {
      accessToken,
      refreshToken,
      tokenizedUser,
    };
  } catch (error) {
    console.error("Error injecting user with token:", error);
    throw new Error("Token injection failed");
  }
};

export const ejectToken = (user) => ({ ...user, refreshToken: null });
