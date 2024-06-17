import request from "supertest";
import fs from "fs/promises";
import { connectDB, getDatabase } from "../config/db.js";
import injectApp from "../app.js";
import * as database from "../controllers/item.controllers.js";

// const database = ;
const app = injectApp(database);
const filePath = connectDB(getDatabase());

beforeEach(async () => {
  await fs.writeFile(filePath, JSON.stringify([{ id: 1, name: 'Item 1' }], null, 2));
});

describe('Items API', () => {
    test('GET /api/v1/items - should return all items', async () => {
        const response = await request(app).get('/api/v1/items');
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0]).toHaveProperty('id', 1);
    });


  it('POST /api/v1/items - should create a new item', async () => {
    const newItem = { id: 2, name: 'Item 2' };
    const res = await request(app).post('/api/v1/items').send(newItem);
    const items = JSON.parse(await fs.readFile(filePath, 'utf-8'));

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id', 2);
    expect(items).toHaveLength(2);
    expect(items[1]).toHaveProperty('name', 'Item 2');
  });

  it('PUT /api/v1/items/:id - should update an existing item', async () => {
    const updatedItem = { id: 1, name: 'Updated Item 1' };
    const res = await request(app).put('/api/v1/items/1').send(updatedItem);
    const items = JSON.parse(await fs.readFile(filePath, 'utf-8'));

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', 'Updated Item 1');
    expect(items[0]).toHaveProperty('name', 'Updated Item 1');
  });

  it('DELETE /api/v1/items/:id - should delete an existing item', async () => {
    const res = await request(app).delete('/api/v1/items/1');
    const items = JSON.parse(await fs.readFile(filePath, 'utf-8'));

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Item deleted');
    expect(items).toHaveLength(0);
  });
});
