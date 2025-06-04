var dbProperties = {
  database: "game_choice", // название базы данных
  username: "root", // имя пользователя, для которого настроены права к базе данных, 'root' задаётся по умолчанию
  password: "", // пароль пользователя, по умолчанию пароль пустой
  host: "localhost", // имя сервера, на котором расположена база данных
  dialect: "mysql", // используемая СУБД
  pool: {
    // параметры соединения
    max: 5, // максимальное количество одновременно открытых соединений
    min: 0, // минимальное количество соединений
    acquire: 30000, // максимальное время в миллисекундах, в течение которого пул (набор соединений к БД) будет пытаться установить соединение, прежде чем выдаст ошибку
    idle: 10000, // время в миллисекундах, в течение которого соединение может простаивать, прежде чем оно будет удалено
  },
};

var Sequelize = require("sequelize");
var sequelize = new Sequelize(
  dbProperties.database,
  dbProperties.username,
  dbProperties.password,
  {
    host: dbProperties.host,
    dialect: dbProperties.dialect,
    pool: {
      max: dbProperties.max,
      min: dbProperties.pool.min,
      acquire: dbProperties.pool.acquire,
      idle: dbProperties.pool.idle,
    },
    define: {
      // имена таблиц не будут создаваться автоматически во множественном числе
      freezeTableName: true,

      // запрет на автоматическое создание полей createdAt и updatedAt (эти поля по умолчанию создаются ORM Sequalize во всех таблицах, при желании можете включить эту настройку)
      timestamps: false,
    },
    logging: false,
  }
);
var db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Подключение моделей
db.User = require("../model/user.model.js")(sequelize, Sequelize);
db.Settings = require("../model/settings.model.js")(sequelize, Sequelize);
db.Save = require("../model/save.model.js")(sequelize, Sequelize);
db.shipStatus = require("../model/shipStatus.model.js")(sequelize, Sequelize);
db.Location = require("../model/location.model.js")(sequelize, Sequelize);
db.Inventory = require("../model/inventory.model.js")(sequelize, Sequelize);
db.JournalEntry = require("../model/journalEntry.model.js")(
  sequelize,
  Sequelize
);
db.Note = require("../model/note.model.js")(sequelize, Sequelize);
db.SaveLocations = require("../model/saveLocations.model.js")(
  sequelize,
  Sequelize
);

// Установка ассоциаций после загрузки всех моделей
Object.keys(db).forEach((modelName) => {
  if (db[modelName] && db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
