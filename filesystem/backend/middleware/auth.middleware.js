import jwt from "jsonwebtoken";

export const verifyToken = (token, secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
};

export const validateAccessToken = async (req, res, next) => {
  const authorization = req.headers.authorization || req.headers.Authorization;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authorization.split(" ")[1];
  try {
    const decoded = await verifyToken(token, process.env.ACCESS_TOKEN);
    req.user = decoded.UserInfo; // abstract away sensitive details from token
    next();
  } catch (err) {
    return res.status(403).json({ message: "Forbidden" });
  }
};

export const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user?.roles)
      return res.status(401).json({ message: "Unauthorized" });

    const hasRole = req.user.roles.some((role) => allowedRoles.includes(role));
    if (!hasRole)
      return res.status(401).json({ message: "Unauthorized" });
    next();
  };
};
