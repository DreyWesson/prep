import { randomUUID } from 'crypto';
import { format } from 'date-fns';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const logEvents = async (msg, logName) => {
    const dateTime = `${format(new Date(), "yyyy-MM-dd HH:mm:ss")}`;
    const logEntry = `${dateTime}\t${randomUUID()}\t${msg}\n`;
    try {
        const logsDir = path.join(__dirname, "..", "logs");
        if (!fs.existsSync(logsDir)) {
            await fsPromises.mkdir(logsDir);
        }
        const logFilePath = path.join(logsDir, `${logName}.log`);
        await fsPromises.appendFile(logFilePath, logEntry);
    } catch (error) {
        console.error(error);
    }
};

export const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "requests");
    next();
};
