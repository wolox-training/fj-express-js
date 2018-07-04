'use strict';

module.exports = {
  up: (queryInterface, DataTypes) =>
    queryInterface.addColumn('users', 'logoutDate', DataTypes.INTEGER, {
      allowNull: false,
      defaultValue: Math.round(Date.now() / 1000)
    }),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('users', 'logoutDate')
};
