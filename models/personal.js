'use strict';
module.exports = (sequelize, DataTypes) => {
  const Personal = sequelize.define('Personal', {
    adminaddress: DataTypes.STRING,
    adminphone: DataTypes.STRING,
    
  }, {});
  Personal.associate = function(models) {
    // associations can be defined here
    models.Personal.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Personal;
};
