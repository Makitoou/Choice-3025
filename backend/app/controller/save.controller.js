const db = require("../config/db.config.js");
const Save = db.save;

// Создание сохранения
exports.create = async (req, res) => {
  try {
    const save = await Save.create({
      ...req.body,
      UserId: req.user.id, // Предполагается аутентификация
    });
    res.status(201).send(save);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Получение всех сохранений пользователя
exports.findAll = async (req, res) => {
  try {
    const saves = await Save.findAll({
      where: { UserId: req.user.id },
      include: [
        { model: db.inventory },
        { model: db.journalEntry },
        { model: db.note },
        { model: db.location },
      ],
    });
    res.status(200).send(saves);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Удаление сохранения
exports.delete = async (req, res) => {
  try {
    await Save.destroy({
      where: { id: req.params.id },
    });
    res.status(200).send({ message: "Сохранение удалено!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
