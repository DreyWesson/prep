import { connectFS, selectDatabase } from '../../config/fs.config.js';
import { readJsonFile, writeJsonFile } from '../../models/fs/item.fs.models.js';

const fsDatabase = connectFS(selectDatabase());

export async function getItems(req, res) {
    const items = await readJsonFile(fsDatabase);
    res.status(200).json(items);
}

export async function createItem(req, res) {
    const items = await readJsonFile(fsDatabase);
    const newItem = req.body;
    items.push(newItem);
    await writeJsonFile(items, fsDatabase);
    res.status(201).json(newItem);
}

export async function updateItem(req, res) {
    const items = await readJsonFile(fsDatabase);
    const updatedItem = req.body;
    const index = items.findIndex(item => item.id === updatedItem.id);
    if (index !== -1) {
        items[index] = updatedItem;
        await writeJsonFile(items, fsDatabase);
        res.status(200).json(updatedItem);
    } else {
        res.status(404).json({ message: 'Item not found' });
    }
}

export async function deleteItem(req, res) {
    const items = await readJsonFile(fsDatabase);
    const id = parseInt(req.params.id, 10);
    const filteredItems = items.filter(item => item.id !== id);
    if (filteredItems.length !== items.length) {
        await writeJsonFile(filteredItems, fsDatabase);
        res.status(200).json({ message: 'Item deleted' });
    } else {
        res.status(404).json({ message: 'Item not found' });
    }
}
