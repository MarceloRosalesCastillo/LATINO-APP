'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserGroup = sequelize.define('UserGroup', {
   
  }, {});
  UserGroup.associate = function(models) {
    // associations can be defined here
    models.UserGroup.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
    models.UserGroup.belongsTo(models.Group, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  return UserGroup;
};
