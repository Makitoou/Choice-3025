const express = require("express");
const router = express.Router();
const auth = require("../controllers/auth.controller");

router.post("/signup", auth.signup);
router.post("/signin", auth.signin);

module.exports = (app) => {
  app.use("/api/auth", router);
};
