export const errorRoute = (req, res) =>
  res.status(404).json({ message: "Not found" });

export const errorLoggerTestRoute = (req, res, next) => {
  try {
    throw new Error("Deliberate error: testing error middleware");
  } catch (error) {
    next(error);
  }
};
