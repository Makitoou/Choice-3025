const db = require("../config/db.config.js");
const Note = db.note;
var { authJwt } = require("../middleware");

// Создание заметки
exports.create = async (req, res) => {
  try {
    const note = await Note.create(req.body);
    res.status(201).send(note);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Получение всех заметок для сохранения
exports.findAll = async (req, res) => {
  try {
    const notes = await Note.findAll({
      where: { SaveId: req.params.saveId },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).send(notes);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Обновление заметки
exports.update = async (req, res) => {
  try {
    await Note.update(req.body, {
      where: { id: req.params.id },
    });
    res.status(200).send({ message: "Заметка обновлена!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Удаление заметки
exports.delete = async (req, res) => {
  try {
    await Note.destroy({
      where: { id: req.params.id },
    });
    res.status(200).send({ message: "Заметка удалена!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
