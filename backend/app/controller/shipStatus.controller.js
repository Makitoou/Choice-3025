const db = require("../config/db.config.js");
const ShipStatus = db.shipStatus;

exports.getStatus = async (req, res) => {
  const userId = req.userId;
  try {
    let status = await ShipStatus.findOne({ where: { userId } });
    if (!status) {
      status = await ShipStatus.create({ userId });
    }
    res.json(status);
  } catch (err) {
    res.status(500).json({ message: "Ошибка получения статуса" });
  }
};

exports.updateStatus = async (req, res) => {
  const userId = req.userId;
  const { shields, fuel } = req.body;

  try {
    const [rowsUpdated] = await ShipStatus.update(
      { shields, fuel },
      { where: { userId } }
    );
    if (rowsUpdated === 0)
      return res.status(404).json({ message: "Статус не найден" });
    res.json({ message: "Статус обновлён" });
  } catch (err) {
    console.error("Ошибка обновления shipStatus:", err);
    res.status(500).json({ message: "Ошибка обновления" });
  }
};
