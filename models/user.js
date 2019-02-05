'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    
    classname: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    lastname: DataTypes.STRING

  }, {});
  User.associate = function(models) {
    User.hasMany(models.Student);
    User.hasMany(models.PurchaseOrder);
    User.hasMany(models.Personal);
    User.hasMany(models.UserGroup);
    User.hasMany(models.Enrollment);
    // associations can be defined here
  };
  return User;
};