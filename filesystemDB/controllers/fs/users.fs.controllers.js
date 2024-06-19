import { connectFS } from "../../config/fs.config.js";
import { readJsonFile, writeJsonFile } from "../../models/fs/fs.models.js";
import dotenv from "dotenv";

dotenv.config();

const usersDatabase = connectFS(process.env.USERS_DB_PATH);

export const getUsers = async (req, res) => {
  const users = await readJsonFile(usersDatabase);
  
  res.status(200).json({ message: "Users fetched successfully", data: users });
}

export const registerUser = async (req, res) => {
  try {
    const users = await readJsonFile(usersDatabase);
    console.log(users);
    const { body } = req;
    users.push(body);
    await writeJsonFile(users, usersDatabase);
    res.status(201).json({ message: "User registered", data: body });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user", error });
  }
}
