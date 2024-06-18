import { promises as fs } from 'fs';

// const filePath = process.env.FILE_PATH;
export async function readJsonFile(filePath) {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
}

export async function writeJsonFile(data, filePath) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}
