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
        allowNull: false,
        type: Sequelize.STRING
      },
      price: {
        allowNull: false,
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
      
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('PurchaseOrderDetails');
  }
};