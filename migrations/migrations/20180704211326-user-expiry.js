'use strict';

module.exports = {
  up: (queryInterface, DataTypes) =>
    queryInterface.addColumn('users', 'logoutDate', DataTypes.DATE(6), {
      allowNull: false,
      defaultValue: DataTypes.NOW
    }),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('users', 'logoutDate')
};
