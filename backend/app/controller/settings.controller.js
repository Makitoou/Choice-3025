const db = require("../config/db.config.js");
const Settings = db.Settings;

// Обновление настроек пользователя
async function update(req, res) {
  try {
    const [settings, created] = await Settings.findOrCreate({
      where: { UserId: req.userId },
      defaults: {
        ...req.body,
        UserId: req.userId,
      },
    });

    if (!created) {
      await settings.update(req.body);
    }

    res.status(200).send({ message: "Настройки сохранены!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

// Получение настроек пользователя
async function findByUser(req, res) {
  try {
    const settings = await Settings.findOne({
      where: { UserId: req.userId },
    });
    res.status(200).send(settings);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

module.exports = {
  update,
  findByUser,
};
