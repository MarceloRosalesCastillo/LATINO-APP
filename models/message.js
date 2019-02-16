'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    subject: DataTypes.STRING,
    bodymessage: DataTypes.STRING(500)
  }, {});
  Message.associate = function(models) {
    // associations can be defined here
  };
  return Message;
};