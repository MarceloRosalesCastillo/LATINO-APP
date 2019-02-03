'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tutor = sequelize.define('Tutor', {
    id_tutor: DataTypes.INT,
    tutorname: DataTypes.STRING,
    tutorlastname: DataTypes.STRING,
    tutoraddress: DataTypes.STRING,
    dni: DataTypes.STRING,
    tutorphone: DataTypes.STRING,
    birthdate: DataTypes.DATE,
    student_id: DataTypes.INT
  }, {});
  Tutor.associate = function(models) {
    // associations can be defined here
    Tutor.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Address;
};