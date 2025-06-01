const db = require("../models");
const Player = db.player;

exports.create = (req, res) => {
  Player.create(req.body)
    .then((player) => res.send(player))
    .catch((err) => res.status(500).send({ message: err.message }));
};

exports.update = (req, res) => {
  Player.update(req.body, {
    where: { id: req.params.id },
  })
    .then(() => res.send({ message: "Player updated!" }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

exports.findOne = (req, res) => {
  Player.findByPk(req.params.id, { include: ["artifacts", "planets"] })
    .then((player) => res.send(player))
    .catch((err) => res.status(500).send({ message: err.message }));
};

exports.updateLocation = (req, res) => {
  Player.update(
    { currentLocation: req.body.location },
    { where: { id: req.params.id } }
  )
    .then(() => res.send({ message: "Location updated!" }))
    .catch((err) => res.status(500).send({ message: err.message }));
};
