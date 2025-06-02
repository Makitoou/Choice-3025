const express = require("express");
const router = express.Router();
const player = require("../controllers/player.controller.js");
const authJwt = require("../middleware/authJwt.js");
const db = require("../models");

// Основные роуты (без дубликатов)
router.post("/", player.create);
router.put("/:id", authJwt.verifyToken, player.update);
router.get("/:id", authJwt.verifyToken, player.findOne);
router.put("/:id/location", authJwt.verifyToken, player.updateLocation);

// Тестовый роут для проверки БД
router.get("/test-db", async (req, res) => {
  try {
    const [results] = await db.sequelize.query("SELECT 1 + 1 AS result");
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = (app) => {
  app.use("/api/players", router);
};
