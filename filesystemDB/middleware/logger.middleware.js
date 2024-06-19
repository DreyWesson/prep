import { randomUUID } from 'crypto';
import { format } from 'date-fns';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const logEvents = async (msg, logName) => {
    const dateTime = `${format(new Date(), "yyyy-MM-dd\tHH:mm:ss")}`;
    const logEntry = `${dateTime}\t${randomUUID()}\t${msg}\n`;

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
        console.error('Error logging event:', error);
    }
};

export const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "requests")
        .catch(error => console.error('Error in logger middleware:', error));
    next();
};
