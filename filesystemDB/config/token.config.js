import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const setToken = (user, secret, expiresIn) => {
  try {
    return jwt.sign(user, secret, {
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
  sameSite: 'None',
  secure: process.env.NODE_ENV === "production", //secure: true on https
};
