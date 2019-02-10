'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Tutors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tutorname: {
        type: Sequelize.STRING
      },
      tutorlastname: {
        type: Sequelize.STRING
      },
      tutoraddress: {
        type: Sequelize.STRING
      },
      dni: {
        type: Sequelize.STRING
      },
      tutorphone: {
        type: Sequelize.STRING
      },
      StudentId:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model: "Students",
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
    return queryInterface.dropTable('Tutors');
  }
};