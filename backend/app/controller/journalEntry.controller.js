const db = require("../config/db.config.js");
const JournalEntry = db.journalEntry;

// Создание записи журнала
exports.create = async (req, res) => {
  try {
    const journalEntry = await JournalEntry.create(req.body);
    res.status(201).send(journalEntry);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Получение всех записей журнала для сохранения
exports.findAll = async (req, res) => {
  try {
    const entries = await JournalEntry.findAll({
      where: { SaveId: req.params.saveId },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).send(entries);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Удаление записи журнала
exports.delete = async (req, res) => {
  try {
    await JournalEntry.destroy({
      where: { id: req.params.id },
    });
    res.status(200).send({ message: "Запись журнала удалена!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
