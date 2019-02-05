'use strict';
module.exports = (sequelize, DataTypes) => {
  const Assistance = sequelize.define('Assistance', {
    
    status: DataTypes.STRING,
    kind: DataTypes.STRING,
    date: DataTypes.DATE
    
  }, {});
  Assistance.associate = function(models) {
    // associations can be defined here
    Assistance.hasMany(models.Enrollment);
  };
  return Assistance;
};