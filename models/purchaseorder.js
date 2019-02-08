'use strict';
module.exports = (sequelize, DataTypes) => {
  const PurchaseOrder = sequelize.define('PurchaseOrder', {
    date: DataTypes.DATE,
    ruc: DataTypes.STRING
  }, {});
  PurchaseOrder.associate = function(models) {
    // associations can be defined here
    models.PurchaseOrder.hasMany(PurchaseOrderDetail);
    models.PurchaseOrder.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  return PurchaseOrder;
};
