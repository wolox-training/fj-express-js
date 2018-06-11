'use strict';

// User migration
module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('Users', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};
