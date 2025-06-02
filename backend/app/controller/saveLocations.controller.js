const db = require("../config/db.config.js");
const SaveLocations = db.saveLocations;

// Обновление связи сохранение-локация
exports.update = async (req, res) => {
  try {
    await SaveLocations.update(req.body, {
      where: {
        SaveId: req.params.saveId,
        LocationId: req.params.locationId,
      },
    });
    res.status(200).send({ message: "Статус локации обновлен!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
