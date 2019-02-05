'use strict';
module.exports = (sequelize, DataTypes) => {
  const Change_log = sequelize.define('Change_log', {
    
    afterchange: DataTypes.STRING,
    beforechange: DataTypes.STRING,
    tablename: DataTypes.STRING,
    username: DataTypes.STRING,

  }, {});
  Change_log.associate = function(models) {
    // associations can be defined here
  };
  return Change_log;
};