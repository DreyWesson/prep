import { cookie } from "express-validator";
import { connectFS } from "../../config/fs.config.js";
import { readJsonFile } from "../../models/fs/fs.models.js";
import jwt from "jsonwebtoken";
import { setToken } from "../../config/token.config.js";

const usersDatabase = connectFS(process.env.USERS_DB_PATH);

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
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      if (decoded.username !== targetUser.username) {
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
    });
  } catch (error) {
    console.error("Error handling refresh token:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
