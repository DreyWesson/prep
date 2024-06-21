import request from "supertest";
import mongoose from "mongoose";
import creatServer from "../app.js";
import { connectNOSQL } from "../config/nosql.config.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import * as fsDatabase from "../controllers/fs/index.fs.controllers.js";
import * as nosqlDatabase from "../controllers/nosql/index.nosql.controllers.js";

const database = false ? nosqlDatabase : fsDatabase;
// dotenv.config();

connectNOSQL();

const app = creatServer(database);
const user = { username: "test", password: "test" };

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Users API", () => {
  describe("POST /api/v1/users/register", () => {
    it("should return 200 if new user created", async () => {
      const { body, status } = await request(app)
        .post("/api/v1/users/register")
        .send(user);

      expect(status).toEqual(201);
      expect(body).toHaveProperty("message", "User registered");
      expect(body).toHaveProperty("data");

      expect(body).toEqual(
        expect.objectContaining({
          message: expect.any(String),
          data: expect.objectContaining({
            username: user.username,
            password: expect.any(String),
          }),
        })
      );
      let res = await request(app).post("/api/v1/users/register").send(user);

      expect(res.status).toEqual(409);
      expect(res.body).toHaveProperty("message", "User already exists");
    });

    it("should return 400 if any data field is invalid", async () => {
      const testCases = [
        {
          user: {
            username: "user1",
            password: "password1",
            extraField: "Extra",
          },
          expectedError: "Invalid fields: extraField",
        },
        {
          user: { password: "password2" },
          expectedError: "Username is required",
        },
        {
          user: { username: "user3" },
          expectedError: "Password is required",
        },
        {
          user: { username: 123, password: "password1" },
          expectedError: "Username must be a string",
        },
        {
          user: { username: "user2", password: true },
          expectedError: "Password must be a string",
        },
      ];

      for (const { user, expectedError } of testCases) {
        const res = await request(app)
          .post("/api/v1/users/register")
          .send(user);

        expect(res.status).toBe(400);
        expect(res.body.errors.map((err) => err.msg)).toContain(expectedError);
      }
    });
  });

  describe("POST /api/v1/users/login", () => {
    it("should return 200 if login is successful", async () => {
      const { body, status } = await request(app)
        .post("/api/v1/users/login")
        .send(user);

      expect(status).toBe(200);
      expect(body).toHaveProperty("message", "Login successful");
      expect(body).toHaveProperty("accessToken");
      user.accessToken = body.accessToken; // In-memory storage of refreshToken for testing
      const decodedToken = await verifyToken(
        user.accessToken,
        process.env.ACCESS_TOKEN
      );
      expect(decodedToken).toEqual(
        expect.objectContaining({
          username: user.username,
          id: expect.any(String),
        })
      );
    });

    it("should return 404 if user does not exist", async () => {
      const { body, status } = await request(app)
        .post("/api/v1/users/login")
        .send({ username: "unknown", password: "unknown" });

      expect(status).toBe(404);
      expect(body).toHaveProperty("message", "Invalid credentials");
    });

    it("should return 401 if password is incorrect", async () => {
      const { body, status } = await request(app)
        .post("/api/v1/users/login")
        .send({ username: user.username, password: "unknown" });

      expect(status).toBe(401);
      expect(body).toHaveProperty("message", "Invalid credentials");
    });
  });

  describe("GET /api/v1/users", () => {
    it("should return 200 if all users are fetched", async () => {
      const { body, status } = await request(app)
        .get("/api/v1/users")
        .set("Authorization", `Bearer ${user.accessToken}`);

      expect(status).toBe(200);
      expect(body).toHaveProperty("message", "Users fetched successfully");
      expect(body).toHaveProperty("data");

      expect(body).toEqual(
        expect.objectContaining({
          message: expect.any(String),
          data: expect.any(Array),
        })
      );

      if (body.data.length > 0) {
        expect(body.data[0]).toEqual(
          expect.objectContaining({
            username: user.username,
            password: expect.any(String),
          })
        );
      }
    });
  });

  describe("DELETE /api/v1/users", () => {
    it("should return 401 if password is incorrect", async () => {
      const { body, status } = await request(app)
        .delete("/api/v1/users")
        .send({ username: user.username, password: "unknown" });

      expect(status).toBe(401);
      expect(body).toHaveProperty("message", "Unauthorized");
    });

    it("should return 404 if username is invalid", async () => {
      const { body, status } = await request(app)
        .delete("/api/v1/users")
        .send({ ...user, username: "unknown" });

      expect(status).toBe(404);
      expect(body).toHaveProperty("message", "User not found");
    });

    it("should return 200 if delete a user", async () => {
      const { body, status } = await request(app)
        .delete(`/api/v1/users`)
        .send(user);

      expect(status).toBe(200);
      expect(body).toHaveProperty("message", "User deleted");
    });
  });

  /// @TODO: Add tests for /api/v1/users/logout and /api/v1/users/refresh-token
});
