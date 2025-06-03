// models/Settings.js
module.exports = (sequelize, DataTypes) => {
  const Settings = sequelize.define("Settings", {
    language: {
      type: DataTypes.ENUM("ru", "en"),
      defaultValue: "ru",
    },
    soundVolume: {
      type: DataTypes.INTEGER,
      defaultValue: 80,
    },
    autosaveInterval: {
      type: DataTypes.INTEGER, // минуты
      defaultValue: 10,
    },
    difficulty: {
      type: DataTypes.ENUM("easy", "normal", "hard"),
      defaultValue: "normal",
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    vibration: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

  Settings.associate = (models) => {
    Settings.belongsTo(models.User);
  };
  return Settings;
};
