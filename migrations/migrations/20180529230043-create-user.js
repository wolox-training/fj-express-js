'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        primaryKey: true
      },
      firstName: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      lastName: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      email: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.TEXT,
        allowNull: false
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
    return queryInterface.dropTable('Users');
  }
};
