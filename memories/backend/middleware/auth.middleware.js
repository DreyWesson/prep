import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";
import ErrorHandler from "../utils/errorHandler.utils.js";

// This auth middleware can be used to protect a route
// Sample: use auth to createPost, deletePost or likePost
export const auth = async (req, res, next) => {
  try {
    let token;
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith("Bearer")) {
      token = authorization.split(" ")[1];
    }
    if (!token) {
      return next(new ErrorHandler("You don't have access to this route", 401));
    }
    // Check if its google token or our custom token
    const isCustomAuth = token.length < 500;

    let decoded;
    if (token && isCustomAuth) {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      // DOUBLE JEOPARDY
      const user = await User.findById(decoded.id);
      const email = await User.findOne({ email: decoded.email });

      if (!user && !email) {
        return next(new ErrorHandler("No user found with this ID", 404));
      }
      req.userId = decoded?.id;
      req.user = user;
    } else {
      decoded = jwt.decode(token);
      req.userId = decoded?.sub;
      req.user = decoded?.sub;
    }
    next();
  } catch (error) {
    console.log("You don't have access to this route");
    return next(new ErrorHandler("You don't have access to this route", 401));
  }
};
