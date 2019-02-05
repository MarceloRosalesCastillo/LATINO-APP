'use strict';
module.exports = (sequelize, DataTypes) => {
  const PurchaseOrder = sequelize.define('PurchaseOrder', {
    date: DataTypes.DATE,
    ruc: DataTypes.STRING
  }, {});
  PurchaseOrder.associate = function(models) {
    // associations can be defined here
    PurchaseOrder.hasMany(PurchaseOrderDetail);
    PurchaseOrder.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  return PurchaseOrder;
};