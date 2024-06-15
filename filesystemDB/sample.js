import { promises as fs } from 'fs';
import path from 'path';

const filePath = path.join(__dirname, 'data.json');


async function readJsonFile() {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
}


async function createItem(newItem) {
    const items = await readJsonFile();
    items.push(newItem);
    await fs.writeFile(filePath, JSON.stringify(items, null, 2));
    console.log('Item added:', newItem);
}

// Usage
// createItem({ id: 4, name: 'Item 4' });


async function readItems() {
    const items = await readJsonFile();
    console.log('Items:', items);
    return items;
}

// Usage
// readItems();


async function updateItem(updatedItem) {
    const items = await readJsonFile();
    const index = items.findIndex(item => item.id === updatedItem.id);
    if (index !== -1) {
        items[index] = updatedItem;
        await fs.writeFile(filePath, JSON.stringify(items, null, 2));
        console.log('Item updated:', updatedItem);
    } else {
        console.log('Item not found:', updatedItem.id);
    }
}

// Usage
// updateItem({ id: 2, name: 'Updated Item 2' });

async function deleteItem(id) {
    const items = await readJsonFile();
    const filteredItems = items.filter(item => item.id !== id);
    if (filteredItems.length !== items.length) {
        await fs.writeFile(filePath, JSON.stringify(filteredItems, null, 2));
        console.log('Item deleted:', id);
    } else {
        console.log('Item not found:', id);
    }
}

// Usage
// deleteItem(3);

