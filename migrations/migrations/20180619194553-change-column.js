'use strict';

module.exports = {
  up: (queryInterface, DataTypes) => {
    queryInterface.addColumn('Users', 'isAdmin', DataTypes.BOOLEAN, {
      allowNull: false,
      after: 'password'
    });
  },

  down: (queryInterface, Sequelize) => queryInterface.dropTable('Users')
};
