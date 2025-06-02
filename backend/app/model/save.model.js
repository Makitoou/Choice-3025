// models/Save.js
module.exports = (sequelize, DataTypes) => {
  const Save = sequelize.define("Save", {
    name: DataTypes.STRING, // Название сохранения
    timestamp: DataTypes.DATE, // Время последнего сохранения
    resources: DataTypes.JSON, // { energy: 100, food: 50, ... }
    gameState: DataTypes.JSON, // Текущее состояние игры
    isAutosave: DataTypes.BOOLEAN, // Автосохранение или ручное
  });

  Save.associate = (models) => {
    Save.belongsTo(models.User);
    Save.hasMany(models.Inventory);
    Save.hasMany(models.JournalEntry);
    Save.hasMany(models.Note);
    Save.belongsToMany(models.Location, { through: "SaveLocations" });
  };
  return Save;
};
