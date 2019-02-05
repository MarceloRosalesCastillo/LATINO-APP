'use strict';
module.exports = (sequelize, DataTypes) => {
  const Enrollment = sequelize.define('Enrollment', {
    paymentmodality: DataTypes.STRING,
    date: DataTypes.DATE,
    price: DataTypes.DECIMAL,
    nquota: DataTypes.INT,
    rate: DataTypes.DECIMAL,
    total: DataTypes.DECIMAL,
    
  }, {});
  Enrollment.associate = function(models) {
    // associations can be defined here
    Enrollment.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
    Enrollment.belongsTo(models.Assistance, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Enrollment;
};