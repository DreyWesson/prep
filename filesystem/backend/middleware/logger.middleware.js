import path from "path";
import { format } from "date-fns";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const logEvents = async (msg, logName, uuid) => {
  const dateTime = `${format(new Date(), "yyyy-MM-dd\tHH:mm:ss")}`;
  const logEntry = `${dateTime}\t${uuid}\t${msg}\n`;

  try {
    const logsDir = path.join(__dirname, "..", "logs");

    try {
      await fs.access(logsDir);
    } catch {
      await fs.mkdir(logsDir);
    }

    const logFilePath = path.join(logsDir, `${logName}.log`);
    await fs.appendFile(logFilePath, logEntry);
  } catch (error) {
    console.error("Error logging event:", error);
  }
};

export const logger = (req, res, next) => {
  req.randomUUID = randomUUID();
  logEvents(
    `${req.method}\t${req.headers.origin}\t${req.url}`,
    "requests",
    req.randomUUID
  ).catch((error) => console.error("Error in logger middleware:", error));
  next();
};

export const errorLogger = (err, req, res, next) => {
  logEvents(`${err.name}: ${err.message}`, "errors", req.randomUUID);
  res
    .status(500)
    .json({ message: err.message, error: "Internal Server Error" });
};
