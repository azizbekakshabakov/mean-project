const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(400).send({ message: "Нету токена" });

  jwt.verify(token, "093uDFGh8raSouah", (error, validToken) => {
    if (error) {
      return res.status(400).send({ message: "Неверный токен" });
    } else {
      req.user = validToken;
      next();
    }
  });
}

module.exports = { auth };
