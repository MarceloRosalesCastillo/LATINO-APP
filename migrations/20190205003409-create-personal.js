'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Personals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      adminaddress: {
        allowNull: false,
        type: Sequelize.STRING
      },
      adminphone: {
        allowNull: false,
        type: Sequelize.STRING
      },
      UserId:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model: "Users",
          key: 'id'
        }
      },
     
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Personals');
  }
};