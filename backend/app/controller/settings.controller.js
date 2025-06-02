const db = require('../config/db.config.js');
const Settings = db.settings;

// Обновление настроек пользователя
exports.update = async (req, res) => {
  try {
    await Settings.update(req.body, {
      where: { UserId: req.user.id }
    });
    res.status(200).send({ message: "Настройки обновлены!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Получение настроек пользователя
exports.findByUser = async (req, res) => {
  try {
    const settings = await Settings.findOne({
      where: { UserId: req.user.id }
    });
    res.status(200).send(settings);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};