'use strict';

module.exports = {
  up: (queryInterface, DataTypes) =>
    queryInterface.addColumn('users', 'isAdmin', DataTypes.BOOLEAN, {
      allowNull: false,
      after: 'password'
    }),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('users', 'isAdmin')
};
