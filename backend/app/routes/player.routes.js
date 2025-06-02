const express = require("express");
const router = express.Router();
const player = require("../controllers/player.controller.js");
const db = require("../models");

// Основные роуты
router.post("/", player.create);
router.put("/:id", player.update);
router.get("/:id", player.findOne);
router.put("/:id/location", player.updateLocation);

// Тестовый роут для проверки БД
router.get("/test-db", async (req, res) => {
  try {
    const [results] = await db.sequelize.query("SELECT 1 + 1 AS result");
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Экспорт роутера
module.exports = (app) => {
  app.use("/api/players", router);
};
