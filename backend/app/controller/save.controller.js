const db = require("../config/db.config.js");
const Save = db.Save;
var { authJwt } = require("../middleware/authJwt.js");

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
        { model: db.Inventory },
        { model: db.JournalEntry },
        { model: db.Note },
        { model: db.Location },
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
exports.getLatest = async (req, res) => {
  try {
    const save = await db.Save.findOne({
      where: { UserId: req.user.id },
      order: [["timestamp", "DESC"]],
    });

    if (!save) {
      return res.status(404).json({ message: "Сохранение не найдено" });
    }

    if (typeof save.gameState === "string") {
      save.gameState = JSON.parse(save.gameState);
    }

    res.json(save);
  } catch (error) {
    console.error("Ошибка getLatest:", error);
    res
      .status(500)
      .json({ message: "Ошибка сервера при получении сохранения" });
  }
};
exports.initSave = async (req, res) => {
  try {
    const save = await Save.create({
      name: req.body.name || "Автосохранение",
      UserId: req.user.id,
      timestamp: new Date(),
      resources: {},
      gameState: JSON.stringify({ phase: "intro" }),
      isAutosave: false,
    });

    res.status(201).send(save);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
exports.findOne = async (req, res) => {
  try {
    const save = await Save.findByPk(req.params.id);
    if (!save) {
      return res.status(404).send({ message: "Сохранение не найдено" });
    }

    // 👇 добавим распаковку gameState
    if (typeof save.gameState === "string") {
      save.gameState = JSON.parse(save.gameState);
    }

    res.status(200).send(save);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
exports.update = async (req, res) => {
  try {
    const save = await Save.findByPk(req.params.id);
    if (!save) {
      return res.status(404).send({ message: "Сохранение не найдено" });
    }

    const updatedFields = {
      timestamp: new Date(),
    };

    if (req.body.resources) {
      updatedFields.resources = req.body.resources;
    }

    if (req.body.gameState) {
      updatedFields.gameState = JSON.stringify(req.body.gameState); // 👈 сериализуем
    }

    await save.update(updatedFields);

    res.status(200).send({ message: "Сохранение обновлено", id: save.id });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
