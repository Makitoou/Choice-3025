const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Импорт моделей
db.player = require("./player.model.js")(sequelize, Sequelize);
db.planet = require("./planet.model.js")(sequelize, Sequelize);
db.artifact = require("./artifact.model.js")(sequelize, Sequelize);
db.playerArtifacts = require("./playerArtifacts.model.js")(
  sequelize,
  Sequelize
);

// Связи между моделями
db.player.belongsToMany(db.artifact, { through: db.playerArtifacts });
db.artifact.belongsToMany(db.player, { through: db.playerArtifacts });
db.player.hasMany(db.planet);
db.planet.belongsTo(db.player);

module.exports = db;
