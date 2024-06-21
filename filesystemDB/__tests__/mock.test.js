import request from "supertest";
import { jest } from "@jest/globals";
import creatServer from "../app.js";

const getItems = jest.fn((req, res) => res.status(200).json([req.body]));
const createItem = jest.fn((req, res) => res.status(201).json(req.body));
const updateItem = jest.fn((req, res) => res.status(200).json(req.body));
const deleteItem = jest.fn((req, res) =>
  res.status(200).json({ message: "Item deleted" })
);

const getUsers = jest.fn((req, res) => res.status(200).json([req.body]));
const deleteUser = jest.fn((req, res) =>
  res.status(200).json({ message: "User deleted" })
);
const loginUser = jest.fn((req, res) =>
  res.status(200).json({ message: "Login successful" })
);
const logoutUser = jest.fn((req, res) =>
  res.status(200).json({ message: "Logout successful" })
);
const registerUser = jest.fn((req, res) =>
  res.status(201).json({ message: "User registered" })
);
const handleRefreshToken = jest.fn((req, res) =>
  res.status(200).json({ message: "Token refreshed" })
);

const errorLoggerTestRoute = jest.fn((req, res) =>
  res.status(200).json({ message: "Error Logger Test Route" })
);
const errorRoute = jest.fn((req, res) =>
  res.status(404).json({ message: "Error Route" })
);

const getHome = jest.fn((req, res) =>
  res.status(200).json({ message: "Home" })
);

const itemController = {
  getItems,
  createItem,
  updateItem,
  deleteItem,
};

const userController = {
  getUsers,
  deleteUser,
  loginUser,
  logoutUser,
  registerUser,
  handleRefreshToken,
};

const otherControllers = { errorLoggerTestRoute, errorRoute };

const app = creatServer({
  itemController,
  homeController: { getHome },
  userController,
  otherControllers,
});

describe("Items API", () => {
  beforeEach(() => {
    getItems.mockClear();
    createItem.mockClear();
    updateItem.mockClear();
    deleteItem.mockClear();
  });
  describe("GET /api/v1/items", () => {
    test("should call getItems", async () => {
      const { body, status } = await request(app).get("/api/v1/items");

      expect(getItems.mock.calls.length).toBe(1);
      expect(status).toBe(200);
      expect(body).toEqual(
        expect.arrayContaining([expect.objectContaining({})])
      );
    });
  });
  it("should call createItem", async () => {
    const itemList = [
      { id: 1, name: "Item 1" },
      { id: 2, name: "Item 2" },
    ];

    for (const item of itemList) {
      createItem.mockClear();
      const { status, body } = await request(app)
        .post("/api/v1/items")
        .send(item);

      expect(createItem.mock.calls.length).toBe(1);
      expect(createItem.mock.calls[0][0].body).toEqual(item);
      expect(status).toEqual(201);
      expect(body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
        })
      );
      expect(body).toEqual(
        expect.objectContaining({
          id: item.id,
          name: item.name,
        })
      );
    }
  });

  it("should update an existing item", async () => {
    const item = { id: 1, name: "Updated Item 1" };
    const { body, status } = await request(app)
      .put("/api/v1/items/1")
      .send(item);

    expect(updateItem.mock.calls.length).toBe(1);
    expect(updateItem.mock.calls[0][0].body).toEqual(item);
    expect(status).toEqual(200);
    expect(body).toHaveProperty("name", item.name);
    expect(body).toHaveProperty("id", item.id);
  });

  it("should delete an existing item", async () => {
    const { status, body } = await request(app).delete("/api/v1/items/1");
    expect(deleteItem.mock.calls.length).toBe(1);
    expect(status).toEqual(200);
    expect(body).toHaveProperty("message", "Item deleted");
  });
});
