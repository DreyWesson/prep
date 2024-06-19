import { connectFS, selectDatabase } from "../../config/fs.config.js";
import { readJsonFile, writeJsonFile } from "../../models/fs/fs.models.js";

const fsDatabase = connectFS(selectDatabase());

export async function getItems(req, res) {
  try {
    const items = await readJsonFile(fsDatabase);

    res.status(200).json({
      message: "Items fetched successfully",
      data: items,
    });
  } catch (error) {
    console.error("Error retrieving items:", error);
    res.status(500).json({ message: "Error retrieving items", error });
  }
}

export async function createItem(req, res) {
  try {
    const items = await readJsonFile(fsDatabase);
    const newItem = req.body;
    console.log(items);
    items.push(newItem);
    await writeJsonFile(items, fsDatabase);
    res.status(201).json({ data: newItem, message: "Item created" });
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ message: "Error creating item", error });
  }
}

export async function updateItem(req, res) {
  try {
    const items = await readJsonFile(fsDatabase);
    const updatedItem = req.body;
    const index = items.findIndex((item) => item.id === updatedItem.id);
    if (index !== -1) {
      items[index] = updatedItem;
      await writeJsonFile(items, fsDatabase);
      res.status(200).json({data: updatedItem, message: "Item updated"});
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ message: "Error updating item", error });
  }
}

export async function deleteItem(req, res) {
  try { 
    const items = await readJsonFile(fsDatabase);
    const id = parseInt(req.params.id, 10);
    const filteredItems = items.filter((item) => item.id !== id);
    if (filteredItems.length !== items.length) {
      await writeJsonFile(filteredItems, fsDatabase);
      res.status(200).json({ message: "Item deleted" });
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ message: "Error deleting item", error });
  }
}

//
//
// OBJECT ORIENTED PROGRAMMING
// class ItemController {
//     constructor(filePath) {
//         this.filePath = filePath;
//     }

//     async getItems(req, res) {
//         try {
//             const items = await readJsonFile(this.filePath);
//             res.status(200).json(items);
//         } catch (error) {
//             res.status(500).json({ message: 'Error reading items', error });
//         }
//     }

//     async createItem(req, res) {
//         try {
//             const items = await readJsonFile(this.filePath);
//             const newItem = req.body;
//             items.push(newItem);
//             await writeJsonFile(items, this.filePath);
//             res.status(201).json(newItem);
//         } catch (error) {
//             res.status(500).json({ message: 'Error creating item', error });
//         }
//     }

//     async updateItem(req, res) {
//         try {
//             const items = await readJsonFile(this.filePath);
//             const updatedItem = req.body;
//             const index = items.findIndex(item => item.id === updatedItem.id);
//             if (index !== -1) {
//                 items[index] = updatedItem;
//                 await writeJsonFile(items, this.filePath);
//                 res.status(200).json(updatedItem);
//             } else {
//                 res.status(404).json({ message: 'Item not found' });
//             }
//         } catch (error) {
//             res.status(500).json({ message: 'Error updating item', error });
//         }
//     }

//     async deleteItem(req, res) {
//         try {
//             const items = await readJsonFile(this.filePath);
//             const id = parseInt(req.params.id, 10);
//             const filteredItems = items.filter(item => item.id !== id);
//             if (filteredItems.length !== items.length) {
//                 await writeJsonFile(filteredItems, this.filePath);
//                 res.status(200).json({ message: 'Item deleted' });
//             } else {
//                 res.status(404).json({ message: 'Item not found' });
//             }
//         } catch (error) {
//             res.status(500).json({ message: 'Error deleting item', error });
//         }
//     }
// }

// export default ItemController;
