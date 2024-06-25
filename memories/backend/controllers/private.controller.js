export const privateData = (req, res, next) =>
  res.status(200).json({
    success: true,
    data: "You've been given access",
  });
