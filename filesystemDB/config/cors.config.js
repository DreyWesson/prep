import { config as configDotenv } from "dotenv";

configDotenv();

const whitelist = ["http://localhost"];
const checkEnv =
  process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test";

export const corsOptions = {
  origin: function (origin, callback) {
    whitelist.indexOf(origin) !== -1 || (!origin && checkEnv)
      ? callback(null, true)
      : callback(new Error("Not allowed by CORS"));
  },
  optionsSuccessStatus: 200,
};
