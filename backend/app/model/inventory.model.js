// models/Inventory.js
module.exports = (sequelize, DataTypes) => {
  const Inventory = sequelize.define("Inventory", {
    itemId: DataTypes.INTEGER, // ID предмета из игрового каталога
    quantity: DataTypes.INTEGER,
    metadata: DataTypes.JSON, // Дополнительные свойства
  });

  Inventory.associate = (models) => {
    Inventory.belongsTo(models.Save);
  };
  return Inventory;
};
