import request from "supertest";
import injectApp from "../app.js";
import * as fsDatabase from "../controllers/fs/index.fs.controllers.js";
import * as nosqlDatabase from "../controllers/nosql/index.nosql.controllers.js";
import { connectNOSQL } from "../config/nosql.config.js";
import mongoose from "mongoose";

const database = (false) ? nosqlDatabase : fsDatabase;

connectNOSQL();
const testID = 42;

const app = injectApp(database);

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Items API", () => {

  describe("GET /api/v1/items", () => {
    it("GET /api/v1/items - should return all items", async () => {
      const { body, status } = await request(app).get("/api/v1/items");

      expect(status).toBe(200);
      expect(body).toHaveProperty("message", "Items fetched successfully");
      expect(body).toHaveProperty("data");
    });
  });

  describe("POST /api/v1/items", () => {
    it("[ SUCCESS ] - should create a new item", async () => {
      const newItem = { id: testID, name: "Item 42" };
      const { body, status } = await request(app)
        .post("/api/v1/items")
        .send(newItem);

      expect(status).toEqual(201);
      expect(body).toHaveProperty("message", "Item created");
      expect(body).toHaveProperty("data");
    });

    it("[ FAILURE ] - should return validation errors for invalid items", async () => {
      const testCases = [
        {
          newItem: { id: testID, name: "Item 1", extra: "Invalid" },
          expectedError: "Invalid fields: extra",
        },
        {
          newItem: { id: testID },
          expectedError: "Name is required",
        },
        {
          newItem: { name: "Item 1" },
          expectedError: "ID is required",
        },
      ];

      for (const { newItem, expectedError } of testCases) {
        const res = await request(app).post("/api/v1/items").send(newItem);
        const errorMsgs = res.body.errors.map((err) => err.msg);

        expect(res.status).toBe(400);
        expect(errorMsgs).toContain(expectedError);
      }
    });
  });

  describe("PUT /api/v1/items/:id", () => {
    it("[ SUCCESS ] - should update an existing item", async () => {
      const updatedItem = { id: testID, name: "Updated Item 1" };
      const { body, status } = await request(app)
        .put(`/api/v1/items/${testID}`)
        .send(updatedItem);

      expect(status).toEqual(200);
      expect(body).toHaveProperty("message", "Item updated");
      expect(body).toHaveProperty("data");
    });

    it("[ FAILURE ] - should not update an existing item", async () => {
      const testCases = [
        {
          newItem: { id: testID, name: "Item 1", extra: "Invalid" },
          expectedError: "Invalid fields: extra",
        },
        {
          newItem: { id: testID },
          expectedError: "Name is required",
        },
        {
          newItem: { name: "Item 1" },
          expectedError: "ID is required",
        },
      ];

      for (const { newItem, expectedError } of testCases) {
        const res = await request(app).put("/api/v1/items/:id").send(newItem);
        const errorMsgs = res.body.errors.map((err) => err.msg);

        expect(res.status).toBe(400);
        expect(errorMsgs).toContain(expectedError);
      }
    });
  });

  describe("DELETE /api/v1/items/:id", () => {
    it("should delete an existing item", async () => {
      const { body, status } = await request(app).delete(
        `/api/v1/items/${testID}`
      );

      expect(status).toEqual(200);
      expect(body).toHaveProperty("message", "Item deleted");
    });
  });
});
