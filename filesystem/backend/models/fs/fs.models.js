import path from 'path';
import { promises as fs } from 'fs';

export async function readJsonFile(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.error(`File not found: ${filePath}`);
            return;
        } else {
            throw error;
        }
    }
}

export async function writeJsonFile(data, filePath) {
    const dir = path.dirname(filePath);
    try {
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(`Error writing to file: ${filePath}`, error);
        throw error;
    }
}

export async function appendData(data, newData, collection) {
    if (newData)
        data.push(newData);
    await writeJsonFile(data, collection);
}

export async function findData(data, field, target) {
   return data.find((user) => user[field] === target); 
}

export async function deleteFile(filePath) {}

export const removeDataBy = (data, field, target) => {
    return data.filter((u) => u[field] !== target);
};