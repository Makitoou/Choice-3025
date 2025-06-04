const db = require("../config/db.config.js");
var { authJwt } = require("../middleware/authJwt.js");
const Inventory = db.Inventory;

// Создание записи инвентаря
exports.create = async (req, res) => {
  try {
    const inventoryData = {
      ...req.body,
      userId: req.userId, // Добавляем userId из токена
    };
    const inventory = await Inventory.create(inventoryData);
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
exports.useItem = async (req, res) => {
  try {
    const userId = req.userId;
    const { file } = req.body;

    console.log("▶ useItem: userId =", userId, "| file =", file);

    const item = await Inventory.findOne({ where: { userId, file } });

    if (!item) {
      console.log("❌ Предмет не найден");
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.quantity < 1) {
      console.log("❌ Нет доступных единиц ресурса");
      return res.status(400).json({ message: "Item out of stock" });
    }

    item.quantity -= 1;
    await item.save();

    console.log("✅ Использован 1 предмет:", file, "осталось:", item.quantity);
    res.json({ message: "Item used" });
  } catch (err) {
    console.error("❌ FATAL ERROR in useItem:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.addItemToInventory = async (req, res) => {
  try {
    console.log("📥 addItemToInventory:", { userId, file, saveId });
    const userId = req.userId; // 👈 получаем userId из токена
    const { file, itemId, quantity, metadata, saveId } = req.body;

    if (!file || !saveId) {
      return res.status(400).json({ message: "file и saveId обязательны" });
    }

    // проверка на существующий предмет
    let item = await Inventory.findOne({
      where: { file, SaveId: saveId, userId },
    });

    if (item) {
      item.quantity += quantity || 1;
      await item.save();
    } else {
      item = await Inventory.create({
        file: file,
        itemId: itemId || null,
        quantity: quantity || 1,
        metadata: metadata || {},
        SaveId: saveId,
        userId, // 👈 сохраняем userId
      });
    }

    res.json(item);
  } catch (err) {
    console.error("❌ Ошибка в addItemToInventory:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
