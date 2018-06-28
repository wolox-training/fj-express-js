'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('UserAlbum', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      albumId: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    }),

  down: (queryInterface, Sequelize) => queryInterface.dropTable('UserAlbum')
};
