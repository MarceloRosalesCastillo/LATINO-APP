'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserGroup = sequelize.define('UserGroup', {
   
  }, {});
  UserGroup.associate = function(models) {
    // associations can be defined here
    UserGroup.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
    UserGroup.belongsTo(models.Group, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  return UserGroup;
};