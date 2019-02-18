'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    
    classname: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    lastname: DataTypes.STRING,
    authentication: DataTypes.STRING,
    code: DataTypes.INTEGER
  }, {});
  User.associate = function(models) {
    models.User.hasMany(models.Student);
    models.User.hasMany(models.PurchaseOrder);
    models.User.hasMany(models.Personal);
    models.User.hasMany(models.UserGroup);
    models.User.hasMany(models.Enrollment);
    // associations can be defined here
  };
  return User;
};
