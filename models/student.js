'use strict';
module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    
    studentaddress: DataTypes.STRING,
    dni: DataTypes.DATE,
    studentphone: DataTypes.STRING,
    birthdate: DataTypes.DATE,
    
  }, {});
  Student.associate = function(models) {
    // associations can be defined here
    Student.hasOne(Tutor)
    Student.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Address;
};