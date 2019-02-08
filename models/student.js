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
    models.Student.hasOne(Tutor);
    models.Student.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Student;
};
