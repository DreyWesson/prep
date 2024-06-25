import { query } from "../../config/sql.config.js";
export async function getItems(req, res) {
  try {
    const items = await query("SELECT * FROM items");

    res.status(200).json({
      message: "Items fetched successfully",
      // size: items.row.length, // best practice for lists
      data: items.rows,
    });
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Error fetching items", error });
  }
}

export async function getItem(req, res) {
  try {
    const item = await query("SELECT * FROM items WHERE id = $1", [
      req.params.id,
    ]);

    res.status(200).json({
      message: "Item fetched successfully",
      data: item.rows[0],
    });
  } catch (error) {
    console.error("Error fetching item:", error);
    res.status(500).json({ message: "Error fetching item", error });
  }
}

export async function createItem(req, res) {
  try {
    const { body } = req;
    const newItem = await query(
      "INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *",
      [body.name, body.description]
    );
    console.log(newItem);
    res.status(201).json({ data: "newItem", message: "Item created" });
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ message: "Error creating item", error });
  }
}

export async function updateItem(req, res) {
  try {
    let updatedItem = await query(
      "Update items SET name = $1, description = $2 WHERE id = $3 RETURNING *",
      [req.body.name, req.body.description, req.params.id]
    );

    return !updatedItem?.rows
      ? res.status(404).json({ message: "Item not found" })
      : res.status(200).json({ data: updatedItem.rows[0], message: "Item updated" });
  } catch (error) {
    console.error("Error updating item:", error);
    return res.status(500).json({ message: "Error updating item", error });
  }
}

export async function deleteItem(req, res) {
  try {
    await query("DELETE FROM items WHERE id = $1", [req.params.id]);
    res.status(200).json({ message: "Item deleted" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ message: "Error deleting item", error });
  }
}
