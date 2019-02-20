'use strict';
module.exports = (sequelize, DataTypes) => {
  const Static_data = sequelize.define('Static_data', {
    ammount: DataTypes.INTEGER
  }, {});
  Static_data.associate = function(models) {
    // associations can be defined here
  };
  return Static_data;
};