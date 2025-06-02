// models/Location.js
module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define("Location", {
    name: DataTypes.STRING, // "Космическая станция Альфа"
    description: DataTypes.TEXT, // Текстовое описание
    coordinates: DataTypes.STRING, // "X:15 Y:42 Z:87"
    discoveredAt: DataTypes.DATE, // Когда открыта
    isCurrent: DataTypes.BOOLEAN, // Текущая локация
  });

  Location.associate = (models) => {
    Location.belongsToMany(models.Save, { through: "SaveLocations" });
  };
  return Location;
};
