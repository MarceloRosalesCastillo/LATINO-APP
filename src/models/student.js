'use strict';
module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    id_student: DataTypes.INT,
    studentname: DataTypes.STRING,
    studentlastname: DataTypes.STRING,
    studentaddress: DataTypes.STRING,
    studentphone: DataTypes.STRING,
    birthdate: DataTypes.DATE,
    user_id: DataTypes.INT
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