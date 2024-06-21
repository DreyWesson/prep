import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const setToken = (user, secret, expiresIn) => {
  const {username, id} = user;
  const minimalCredentials = { username, id };
  try {
    return jwt.sign(minimalCredentials, secret, {
      expiresIn,
    });
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Token generation failed");
  }
};

export const cookieOptions = {
  httpOnly: true,
  maxAge: 1000 * 60 * 60 * 24,
  sameSite: "None",
  secure: process.env.NODE_ENV === "production", //secure: true on https
};
