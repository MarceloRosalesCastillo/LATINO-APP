'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Static_data', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ammount: {
        type: Sequelize.INTEGER
      },
      
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Static_data');
  }
};