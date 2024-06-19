import request from "supertest";
import injectApp from "../app.js";
import * as fsDatabase from "../controllers/fs/index.fs.controllers.js";
import * as nosqlDatabase from "../controllers/nosql/index.nosql.controllers.js";
import { connectNOSQL } from "../config/nosql.config.js";
import mongoose from "mongoose";

const database = false ? nosqlDatabase : fsDatabase;

connectNOSQL();
const testID = 42;

const app = injectApp(database);

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Users API", () => {
  describe("GET /api/v1/users", () => {
    it("GET /api/v1/users - should return all users", async () => {
      const { body, status } = await request(app).get("/api/v1/users");

      expect(status).toBe(200);
      expect(body).toHaveProperty("message", "Users fetched successfully");
      expect(body).toHaveProperty("data");

      expect(body).toEqual(
        expect.objectContaining({
          message: expect.any(String),
          data: expect.any(Array),
        })
      );
      //Additional checks if data is not empty
      if (body.data.length > 0) {
        expect(body.data[0]).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            username: newUser.username,
          })
        );
      }
    });
  });

  describe("POST /api/v1/users/register", () => {
    it("[ SUCCESS ] - should register a new user", async () => {
      const newUser = { username: "test", password: "test" };
      const { body, status } = await request(app)
        .post("/api/v1/users/register")
        .send(newUser);

      expect(status).toEqual(201);
      expect(body).toHaveProperty("message", "User registered");
      expect(body).toHaveProperty("data");

      expect(body).toEqual(
        expect.objectContaining({
          message: expect.any(String),
          data: expect.objectContaining({
            username: newUser.username,
            password: newUser.password,
        }),
        })
      );

    });

    // it("[ FAILURE ] - should return validation errors for invalid users", async () => {
    //   const testCases = [
    //     {
    //       newUser: { id: testID, name: "User 1", extra: "Invalid" },
    //       expectedError: "Invalid fields: extra",
    //     },
    //     {
    //       newUser: { id: testID },
    //       expectedError: "Name is required",
    //     },
    //     {
    //       newUser: { name: "User 1" },
    //       expectedError: "ID is required",
    //     },
    //   ];

    //   for (const { newUser, expectedError } of testCases) {
    //     const res = await request(app)
    //       .post("/api/v1/users/register")
    //       .send(newUser);

    //     expect(res.status).toEqual(500);
    //     expect(res.body).toHaveProperty("message", "Error registering user");
    //     expect(res.body).toHaveProperty("error");
    //   }
    // });
  });
});
