const db = require("../models");
const Artifact = db.artifact;

exports.collectArtifact = (req, res) => {
  db.playerArtifacts
    .update(
      { collected: true },
      {
        where: {
          playerId: req.params.playerId,
          artifactId: req.params.artifactId,
        },
      }
    )
    .then(() => res.send({ message: "Artifact collected!" }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

exports.create = (req, res) => {
  Artifact.create(req.body)
    .then((artifact) => res.send(artifact))
    .catch((err) => res.status(500).send({ message: err.message }));
};
