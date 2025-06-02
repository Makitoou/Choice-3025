const db = require("../config/db.config.js");
const Inventory = db.inventory;

// Создание записи инвентаря
exports.create = async (req, res) => {
  try {
    const inventory = await Inventory.create(req.body);
    res.status(201).send(inventory);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Получение всех записей инвентаря для сохранения
exports.findAll = async (req, res) => {
  try {
    const inventories = await Inventory.findAll({
      where: { SaveId: req.params.saveId },
    });
    res.status(200).send(inventories);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Обновление записи инвентаря
exports.update = async (req, res) => {
  try {
    await Inventory.update(req.body, {
      where: { id: req.params.id },
    });
    res.status(200).send({ message: "Запись инвентаря обновлена!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Удаление записи инвентаря
exports.delete = async (req, res) => {
  try {
    await Inventory.destroy({
      where: { id: req.params.id },
    });
    res.status(200).send({ message: "Запись инвентаря удалена!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
