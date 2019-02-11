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
        allowNull: false,
        type: Sequelize.STRING
      },
      tutorlastname: {
        allowNull: false,
        type: Sequelize.STRING
      },
      tutoraddress: {
        allowNull: false,
        type: Sequelize.STRING
      },
      dni: {
        allowNull: false,
        type: Sequelize.STRING
      },
      tutorphone: {
        allowNull: false,
        type: Sequelize.STRING
      },
      StudentId:{
        allowNull: false,
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model: "Students",
          key: 'id'
        }
      },
      
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Tutors');
  }
};