const db = require("../config/db.config.js");
const User = db.User;

exports.checkDuplicateUsername = (req, res, next) => {
  if (!User) {
    console.error("❌ Модель User не найдена в db.config.js");
    return res.status(500).send({ message: "Ошибка сервера: User недоступен" });
  }

  // Проверка имени пользователя
  User.findOne({
    where: { username: req.body.username },
  })
    .then((user) => {
      if (user) {
        return res.status(400).send({
          message: "Пользователь с таким логином уже существует",
        });
      }

      // Проверка email
      return User.findOne({
        where: { email: req.body.email },
      });
    })
    .then((userWithSameEmail) => {
      if (userWithSameEmail) {
        return res.status(400).send({
          message: "Пользователь с таким email уже существует",
        });
      }

      // Всё ок — передаём управление дальше
      next();
    })
    .catch((err) => {
      console.error("Ошибка проверки дубликатов:", err);
      res
        .status(500)
        .send({ message: "Ошибка сервера при проверке пользователя" });
    });
};
