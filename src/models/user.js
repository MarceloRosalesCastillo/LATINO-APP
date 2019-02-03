'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: DataTypes.INT,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING

  }, {});
  User.associate = function(models) {
    User.hasMany(models.Student);
    // associations can be defined here
  };
  return User;
};