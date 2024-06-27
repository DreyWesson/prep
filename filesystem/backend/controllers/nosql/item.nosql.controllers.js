import Item from "../../models/nosql/items.nosql.model.js";

export async function getItems(req, res) {
  try {
    const items = await Item.find();
    res.status(200).json({
      message: "Items fetched successfully",
      data: items,
    });
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Error fetching items", error });
  }
}

export async function createItem(req, res) {
  try {
    const { body } = req;
    const newItem = await Item.create(body);

    res.status(201).json({ data: newItem, message: "Item created" });
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ message: "Error creating item", error });
  }
}

export async function updateItem(req, res) {
  try {
    let updatedItem = await Item.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    return !updatedItem
      ? res.status(404).json({ message: "Item not found" })
      : res.status(200).json({ data: updatedItem, message: "Item updated" });
  } catch (error) {
    console.error("Error updating item:", error);
    return res.status(500).json({ message: "Error updating item", error });
  }
}

export async function deleteItem(req, res) {
  try {
    let item = await Item.findOne({id: req.params.id});
    item = await item.deleteOne();
    res.status(200).json({ message: "Item deleted" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ message: "Error deleting item", error });
  }
}
