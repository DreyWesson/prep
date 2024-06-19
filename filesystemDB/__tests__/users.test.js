import request from "supertest";
import injectApp from "../app.js";
import * as fsDatabase from "../controllers/fs/index.fs.controllers.js";
import * as nosqlDatabase from "../controllers/nosql/index.nosql.controllers.js";
import { connectNOSQL } from "../config/nosql.config.js";
import mongoose from "mongoose";

const database = false ? nosqlDatabase : fsDatabase;

connectNOSQL();

const app = injectApp(database);
const newUser = { username: "test", password: "test" };

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
            username: newUser.username,
            password: newUser.password,
          })
        );
      }
    });
  });

  describe("POST /api/v1/users/register", () => {
    it("[ SUCCESS ] - should register a new user", async () => {
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
    it("should return validation errors if username or password are not strings", async () => {
      const testCases = [
        {
          newUser: {
            username: "user1",
            password: "password1",
            extraField: "Extra",
          },
          expectedError: "Invalid fields: extraField",
        },
        {
          newUser: { password: "password2" },
          expectedError: "Username is required",
        },
        {
          newUser: { username: "user3" },
          expectedError: "Password is required",
        },
        {
          newUser: { username: 123, password: "password1" },
          expectedError: "Username must be a string",
        },
        {
          newUser: { username: "user2", password: true },
          expectedError: "Password must be a string",
        }
      ];

      for (const { newUser, expectedError } of testCases) {
        const res = await request(app)
          .post("/api/v1/users/register")
          .send(newUser);

        expect(res.status).toBe(400);
        expect(res.body.errors.map((err) => err.msg)).toContain(expectedError);
      }
    });
  });
});
