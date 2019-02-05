'use strict';
module.exports = (sequelize, DataTypes) => {
  const PurchaseOrderDetail = sequelize.define('PurchaseOrderDetail', {
    concept: DataTypes.STRING,
    price: DataTypes.DECIMAL
    

  }, {});
  PurchaseOrderDetail.associate = function(models) {
    // associations can be defined here
    PurchaseOrderDetail.belongsTo(models.PurchaseOrder, {
      foreignKey: {
        allowNull: false
      }
    });
    PurchaseOrderDetail.belongsTo(models.Enrollment, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  return PurchaseOrderDetail;
};