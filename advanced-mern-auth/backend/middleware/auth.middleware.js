import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ErrorHandler from "../utils/errorHandler.js";

export const shield = async (req, res, next) => {
  let token;
  // const { authorisation } = req.headers;
  // if (authorisation && authorisation.startsWith("Bearer")) {
  //   token = authorisation.split(" ")[1];
  // }

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ErrorHandler("You don't have access to this route", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ErrorHandler("No user found with this ID", 404));
    }
    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorHandler("You don't have access to this route", 401));
  }
};
