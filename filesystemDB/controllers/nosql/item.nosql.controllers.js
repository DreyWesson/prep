import ItemsNosqlModel from "../../models/nosql/items.nosql.model.js";


export async function getItems(req, res, filePath) {
    const item = await Item.find();
    return res.status(200).json(item);
}