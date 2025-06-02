const db = require("../config/db.config.js");
const User = db.user;

// Регистрация пользователя
exports.register = async (req, res) => {
  try {
    const user = await User.create(req.body);
    // Автоматическое создание настроек по умолчанию
    await db.settings.create({ UserId: user.id });
    res.status(201).send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Получение профиля пользователя
exports.profile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["passwordHash"] },
      include: [db.settings],
    });
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Обновление профиля
exports.update = async (req, res) => {
  try {
    await User.update(req.body, {
      where: { id: req.user.id },
      individualHooks: true, // Для хеширования пароля
    });
    res.status(200).send({ message: "Профиль обновлен!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
