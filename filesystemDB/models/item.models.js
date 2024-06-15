import { promises as fs } from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const filePath = process.env.FILE_PATH;
export async function readJsonFile() {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
}

export async function writeJsonFile(data) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}
