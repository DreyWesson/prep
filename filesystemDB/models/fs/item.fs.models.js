// import { promises as fs } from 'fs';

// export async function readJsonFile(filePath) {
//     const data = await fs.readFile(filePath, 'utf-8');
//     return JSON.parse(data);
// }

// export async function writeJsonFile(data, filePath) {
//     await fs.writeFile(filePath, JSON.stringify(data, null, 2));
// }

import { promises as fs } from 'fs';
import path from 'path';

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
