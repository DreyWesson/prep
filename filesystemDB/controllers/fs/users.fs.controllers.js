import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import {
  appendData,
  findData,
  readJsonFile,
  removeDataBy,
  } from "../../models/fs/fs.models.js";
  import { verifyToken } from "../../middleware/auth.middleware.js";
  import { cookieOptions, setToken } from "../../config/token.config.js";
  import { connectFS, ejectToken, injectToken } from "../../config/fs.config.js";

const usersDatabase = connectFS(process.env.USERS_DB_PATH);

export const getUsers = async (req, res) => {
  const users = await readJsonFile(usersDatabase);

  res.status(200).json({ message: "Users fetched successfully", data: users });
};

export const registerUser = async (req, res) => {
  try {
    const users = await readJsonFile(usersDatabase);
    let { body } = req;
    if (!body.username || !body.password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const existingUser = await findData(users, "username", body.username);

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    body = {
      ...body,
      id: randomUUID(),
      password: await bcrypt.hash(body.password, 10),
      createdAt: new Date().toISOString(),
    };
    await appendData(users, body, usersDatabase);
    res.status(201).json({ message: "User registered", data: body });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user", error });
  }
};

export const loginUser = async (req, res) => {
  try {
    const allUsers = await readJsonFile(usersDatabase);
    const { username, password } = req.body;
    const targetUser = await findData(allUsers, "username", username);

    if (!targetUser) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, targetUser.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Create a JWT token
    const otherUsers = removeDataBy(allUsers, "username", username);
    const { accessToken, refreshToken, tokenizedUser } =
      injectToken(targetUser);
    await appendData(otherUsers, tokenizedUser, usersDatabase);
    res.cookie("jwt", refreshToken, cookieOptions);
    res.status(200).json({ message: "Login successful", accessToken });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Error logging in user", error });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const users = await readJsonFile(usersDatabase);
    const { username, password } = req.body;
    const user = await findData(users, "username", username);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const filteredUsers = removeDataBy(users, "username", username);

    if (filteredUsers.length !== users.length) {
      await appendData(filteredUsers, null, usersDatabase);
      res.status(200).json({ message: "User deleted" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user", error });
  }
};

export const logoutUser = async (req, res) => {
  // On client side, delete the accessToken from memory too
  try {
    let { cookies } = req;

    if (!cookies || !cookies.jwt) {
      return res.status(204).json({ message: "Token Erased" });
    }

    const refreshToken = cookies.jwt;

    const allUsers = await readJsonFile(usersDatabase);
    const targetUser = await findData(allUsers, "refreshToken", refreshToken);

    if (!targetUser) {
      res.clearCookie("jwt", cookieOptions);
      return res.status(204).json({ message: "Token Erased" });
    }
    const otherUsers = removeDataBy(
      allUsers,
      "refreshToken",
      targetUser.refreshToken
    );
    const loggedOutUser = ejectToken(targetUser);
    await appendData(otherUsers, loggedOutUser, usersDatabase);
    res.clearCookie("jwt", cookieOptions);
    res.status(204).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error handling refresh token:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const handleRefreshToken = async (req, res) => {
  try {
    let { cookies } = req;

    if (!cookies || !cookies.jwt) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const refreshToken = cookies.jwt;

    const allUsers = await readJsonFile(usersDatabase);
    const targetUser = allUsers.find(
      (user) => user.refreshToken === refreshToken
    );

    if (!targetUser) {
      return res.status(403).json({ message: "Forbidden" });
    }
    // Verify the refresh token
    try {
      const decodedToken = await verifyToken(
        refreshToken,
        process.env.REFRESH_TOKEN
      );

      if (decodedToken.username !== targetUser.username) {
        return res.status(403).json({ message: "User mismatch" });
      }

      const newAccessToken = setToken(
        targetUser,
        process.env.ACCESS_TOKEN,
        "60s"
      );
      res.json({
        message: "New Access Token Generated",
        accessToken: newAccessToken,
      });
    } catch (err) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }
  } catch (error) {
    console.error("Error handling refresh token:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
