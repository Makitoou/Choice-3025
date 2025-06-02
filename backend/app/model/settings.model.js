// models/Settings.js
module.exports = (sequelize, DataTypes) => {
  const Settings = sequelize.define("Settings", {
    language: {
      type: DataTypes.STRING,
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
  });

  Settings.associate = (models) => {
    Settings.belongsTo(models.User);
  };
  return Settings;
};
