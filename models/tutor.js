'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tutor = sequelize.define('Tutor', {
    
    tutorname: DataTypes.STRING,
    tutorlastname: DataTypes.STRING,
    tutoraddress: DataTypes.STRING,
    dni: DataTypes.STRING,
    tutorphone: DataTypes.STRING,
    
  }, {});
  Tutor.associate = function(models) {
    // associations can be defined here
    Tutor.belongsTo(models.Student, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Address;
};