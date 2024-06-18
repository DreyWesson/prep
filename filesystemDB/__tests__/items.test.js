import request from "supertest";
import fs from "fs/promises";
import { connectFS, selectDatabase } from "../config/fs.config.js";
import injectApp from "../app.js";
import * as database from "../controllers/fs/index.fs.controllers.js";
import exp from "constants";

const app = injectApp(database);
const filePath = connectFS(selectDatabase());

beforeEach(async () => {
  await fs.writeFile(
    filePath,
    JSON.stringify([{ id: 1, name: "Item 1" }], null, 2)
  );
});

describe("Items API", () => {
  test("GET /api/v1/items - should return all items", async () => {
    const { body, status } = await request(app).get("/api/v1/items");

    expect(status).toBe(200);
    expect(body).toHaveProperty("message", "Items fetched successfully");
    expect(body).toHaveProperty("data");
  });

  describe("POST /api/v1/items", () => {
    it("[SUCCESS] - should create a new item", async () => {
      const newItem = { id: 2, name: "Item 2" };
      const { body, status } = await request(app)
        .post("/api/v1/items")
        .send(newItem);

      expect(status).toEqual(201);
      expect(body).toHaveProperty("message", "Item created");
      expect(body).toHaveProperty("data");
    });

    it("should return validation errors for invalid items", async () => {
      const testCases = [
        {
          newItem: { id: 1, name: "Item 1", extra: "Invalid" },
          expectedError: "Invalid fields: extra",
        },
        {
          newItem: { id: 1 },
          expectedError: "Name is required",
        },
        {
          newItem: { name: "Item 1" },
          expectedError: "ID is required",
        },
      ];

      for (const { newItem, expectedError } of testCases) {
        const res = await request(app).post("/api/v1/items").send(newItem);
        expect(res.status).toBe(400);
        const errorMsgs = res.body.errors.map((err) => err.msg);
        expect(errorMsgs).toContain(expectedError);
      }
    });
  });

  describe("PUT /api/v1/items/:id", () => {
    it("should update an existing item", async () => {
      const updatedItem = { id: 1, name: "Updated Item 1" };
      const { body, status } = await request(app)
        .put("/api/v1/items/1")
        .send(updatedItem);

      expect(status).toEqual(200);
      expect(body).toHaveProperty("message", "Item updated");
      expect(body).toHaveProperty("data");
    });

    it("should not update an existing item", async () => {
      const testCases = [
        {
          newItem: { id: 1, name: "Item 1", extra: "Invalid" },
          expectedError: "Invalid fields: extra",
        },
        {
          newItem: { id: 1 },
          expectedError: "Name is required",
        },
        {
          newItem: { name: "Item 1" },
          expectedError: "ID is required",
        },
      ];

      for (const { newItem, expectedError } of testCases) {
        const res = await request(app).put("/api/v1/items/:id").send(newItem);
        expect(res.status).toBe(400);
        const errorMsgs = res.body.errors.map((err) => err.msg);
        expect(errorMsgs).toContain(expectedError);
      }
    });
  });

  describe("DELETE /api/v1/items/:id", () => {
    it("should delete an existing item", async () => {
      const { body, status } = await request(app).delete("/api/v1/items/1");

      expect(status).toEqual(200);
      expect(body).toHaveProperty("message", "Item deleted");
    });
  });
});
