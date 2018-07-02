'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface
      .createTable('useralbums', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          unique: 'compositeIndex'
        },
        albumId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          unique: 'compositeIndex'
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      })
      .then(() =>
        queryInterface.addIndex('useralbums', ['userId', 'albumId'], {
          indicesType: 'UNIQUE'
        })
      ),

  down: (queryInterface, Sequelize) =>
    queryInterface
      .removeIndex('useralbums', ['userId', 'albumId'])
      .then(() => queryInterface.dropTable('userAlbum'))
};
