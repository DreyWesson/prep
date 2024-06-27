import { config as configDotenv } from "dotenv";

configDotenv();

export const allowedOrigins = ["http://localhost", "http://localhost:3000"];

const checkEnv =
  process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test";

export const corsOptions = {
  origin: function (origin, callback) {
    allowedOrigins.indexOf(origin) !== -1 || (!origin && checkEnv)
      ? callback(null, true)
      : callback(new Error("Not allowed by CORS"));
  },
  optionsSuccessStatus: 200,
};

