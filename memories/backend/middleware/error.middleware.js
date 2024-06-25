import ErrorHandler from "../utils/errorHandler.utils.js";

const errorResponse = (err, req, res, next) => {
  let error = { ...err };
  console.log(err);
  error.message = err.message;

  if (err.code === 11000) {
    const message = "Duplicate Field Value Entered";
    error = new ErrorHandler(message, 400);
  }
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorHandler(message, 400);
  }
  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || "Server Error" });
};

export default errorResponse;
