import { connectFS, injectUserWithToken } from "../../config/fs.config.js";
import { readJsonFile, writeJsonFile } from "../../models/fs/fs.models.js";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { cookieOptions } from "../../config/token.config.js";

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
    const existingUser = users.find((user) => user.username === body.username);

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    body = {
      ...body,
      id: randomUUID(),
      password: await bcrypt.hash(body.password, 10),
      createdAt: new Date().toISOString(),
    };

    users.push(body);
    await writeJsonFile(users, usersDatabase);
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
    const targetUser = allUsers.find((user) => user.username === username);

    if (!targetUser) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, targetUser.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Create a JWT token
    const { accessToken, refreshToken, tokenizedUser } = injectUserWithToken(
      allUsers,
      targetUser,
      username
    );

    await writeJsonFile(tokenizedUser, usersDatabase);
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
    const user = users.find((user) => user.username === username);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const filteredUsers = users.filter((user) => user.username !== username);

    if (filteredUsers.length !== users.length) {
      await writeJsonFile(filteredUsers, usersDatabase);
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
  try {
    let { cookies } = req;

    if (!cookies || !cookies.jwt) {
      return res.status(204).json({ message: "Token Erased" });
    }

    const refreshToken = cookies.jwt;

    const allUsers = await readJsonFile(usersDatabase);
    const targetUser = allUsers.find(
      (user) => user.refreshToken === refreshToken
    );

    if (!targetUser) {
      res.clearCookie("jwt", cookieOptions);
      return res.status(204).json({ message: "Token Erased" });
    }
    const currentuser = { ...targetUser, refreshToken: null };
    const otherUsers = allUsers.filter(
      (user) => user.refreshToken !== targetUser.refreshToken
    );
    otherUsers.push(currentuser);
    await writeJsonFile(otherUsers, usersDatabase);
    res.clearCookie("jwt", cookieOptions); //secure: true on https
    res.status(204).json({ message: "Token Erased" });
  } catch (error) {
    console.error("Error handling refresh token:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
