'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      classname: {
        allowNull: true,
        type: Sequelize.STRING
        
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      lastname: {
        allowNull: false,
        type: Sequelize.STRING
      },
      authentication: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.STRING
      },
      code: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};