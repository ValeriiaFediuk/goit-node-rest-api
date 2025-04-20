'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('contacts', 'createdAt', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('now'),
    });
    await queryInterface.addColumn('contacts', 'updatedAt', {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('now'),
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('contacts', 'createdAt');
    await queryInterface.removeColumn('contacts', 'updatedAt');
  }
};
