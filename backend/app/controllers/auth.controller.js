const db = require("../models");
const Player = db.player;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config/auth.config");

// Регистрация нового пользователя
exports.signup = async (req, res) => {
  try {
    const player = await Player.create({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    });

    res.send({ message: "Player registered successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Аутентификация пользователя
exports.signin = async (req, res) => {
  try {
    const player = await Player.findOne({
      where: { username: req.body.username },
    });

    if (!player) {
      return res.status(404).send({ message: "Player Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      player.password
    );

    if (!passwordIsValid) {
      return res.status(401).json({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    const token = jwt.sign({ id: player.id }, config.secret, {
      expiresIn: 86400, // 24 часа
    });

    res.status(200).send({
      id: player.id,
      username: player.username,
      email: player.email,
      accessToken: token,
    });
  } catch (err) {
    console.error("Auth error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
