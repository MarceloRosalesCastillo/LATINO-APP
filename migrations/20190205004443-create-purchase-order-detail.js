'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('PurchaseOrderDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      concept: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.DECIMAL
      },
      PurchaseOrderId:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model: "PurchaseOrders",
          key: 'id'
        }
      },
      EnrollmentId:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model: "Enrollments",
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('PurchaseOrderDetails');
  }
};