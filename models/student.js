'use strict';
module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    
    dni: DataTypes.STRING,
    phone: DataTypes.STRING,
    birthdate: DataTypes.DATE,
    address: DataTypes.STRING,
    
  }, {});
  Student.associate = function(models) {
    // associations can be defined here
    models.Student.hasOne(Tutor);
    models.Student.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Student;
};
