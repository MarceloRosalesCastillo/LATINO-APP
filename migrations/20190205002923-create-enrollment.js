'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Enrollments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      paymentmodality: {
        allowNull: false,
        type: Sequelize.STRING
      },
      date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      price: {
        allowNull: false,
        type: Sequelize.DECIMAL
      },
      nquota: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      rate: {
        allowNull: false,
        type: Sequelize.DECIMAL(10,2)
      },
      total: {
        allowNull: false,
        type: Sequelize.DECIMAL(10,2)
      },
      UserId:{
        allowNull: false,
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
    return queryInterface.dropTable('Enrollments');
  }
};