const db = require("../config/db.config.js");
const Location = db.location;
var { authJwt } = require("../middleware");

// Добавление новой локации
exports.create = async (req, res) => {
  try {
    const location = await Location.create(req.body);
    res.status(201).send(location);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Получение всех локаций для сохранения
exports.findBySave = async (req, res) => {
  try {
    const locations = await Location.findAll({
      include: [
        {
          model: db.save,
          where: { id: req.params.saveId },
          through: { attributes: ["status"] },
        },
      ],
    });
    res.status(200).send(locations);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Обновление статуса локации для сохранения
exports.updateStatus = async (req, res) => {
  try {
    const save = await db.save.findByPk(req.params.saveId);
    await save.setLocations(req.body.locations, {
      through: { status: req.body.status },
    });
    res.status(200).send({ message: "Статус локации обновлен!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
