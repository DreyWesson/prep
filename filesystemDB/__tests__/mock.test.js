import request from "supertest";

import injectApp from "../app.js";
import { jest } from "@jest/globals";

const getItems = jest.fn((req, res) =>
  res.status(200).json([req.body])
);
const createItem = jest.fn((req, res) =>
  res.status(201).json(req.body)
);
const updateItem = jest.fn((req, res) =>
  res.status(200).json(req.body)
);
const deleteItem = jest.fn((req, res) =>
  res.status(200).json({ message: "Item deleted" })
);

const app = injectApp({
  getItems,
  createItem,
  updateItem,
  deleteItem,
});


describe("Items API", () => {
  beforeEach(() => {
    getItems.mockClear();
    createItem.mockClear();
    updateItem.mockClear();
    deleteItem.mockClear();
  });

  test("should call getItems", async () => {
    await request(app).get("/api/v1/items");
    expect(getItems.mock.calls.length).toBe(1);
  });

  it('should call createItem', async () => {
    const itemList = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];
    for (const item of itemList) {
      createItem.mockClear();

      await request(app).post('/api/v1/items').send(item);
      expect(createItem.mock.calls.length).toBe(1);
      expect(createItem.mock.calls[0][0].body).toEqual(item);
    }
  });

  it('should update an existing item', async () => {
    const item = { id: 1, name: 'Updated Item 1' };
    await request(app).put('/api/v1/items/1').send(item);

    expect(updateItem.mock.calls.length).toBe(1);
    expect(updateItem.mock.calls[0][0].body).toEqual(item);
  });

  it('should delete an existing item', async () => {
    const res = await request(app).delete('/api/v1/items/1');
    expect(deleteItem.mock.calls.length).toBe(1);
  });
});
