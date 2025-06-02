const express = require("express");
const router = express.Router();
const controller = require("../controller/journalEntry.controller.js");

var { authJwt } = require("../middleware");
router.post("/", authJwt.verifyToken, controller.create);
router.get("/save/:saveId", authJwt.verifyToken, controller.findAll);
router.delete("/:id", authJwt.verifyToken, controller.delete);

module.exports = router;
