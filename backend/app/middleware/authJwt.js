const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

exports.verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "⛔ Токен не предоставлен" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .send({ message: "⛔ Невалидный или просроченный токен" });
    }

    req.user = { id: decoded.id }; // 🔐 теперь доступен как req.user.id
    next();
  });
};
