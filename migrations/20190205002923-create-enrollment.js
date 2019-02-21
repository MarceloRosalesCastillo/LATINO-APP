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
      status: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      date_quota: {
        allowNull: true,
        type: Sequelize.DATE
      },
     
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Enrollments');
  }
};
//CREATE EVENT control_enrollment ON SCHEDULE EVERY 1 DAY DO UPDATE enrollments SET status= "off" WHERE date <= DATE_SUB(CURDATE(), INTERVAL 90 DAY)