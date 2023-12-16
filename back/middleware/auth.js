import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(400).json({ message: "нету токена" });
  try {
    const decoded = jwt.verify(token, "qwerty");
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(400).json({ message: "неверный токен" });
  }
};
