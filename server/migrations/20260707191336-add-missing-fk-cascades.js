'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // These columns were created without DB-level foreign key constraints,
    // so the onDelete: 'CASCADE' declared in the Sequelize model associations
    // (models/board.js, models/list.js) was never actually enforced by Postgres —
    // deleting a board silently orphaned its lists, and deleting a list silently
    // orphaned its cards.
    await queryInterface.addConstraint('Lists', {
      fields: ['boardId'],
      type: 'foreign key',
      name: 'lists_boardId_fkey',
      references: { table: 'Boards', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('Cards', {
      fields: ['listId'],
      type: 'foreign key',
      name: 'cards_listId_fkey',
      references: { table: 'Lists', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('Boards', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'boards_userId_fkey',
      references: { table: 'Users', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint('Cards', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'cards_userId_fkey',
      references: { table: 'Users', field: 'id' },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('Cards', 'cards_userId_fkey');
    await queryInterface.removeConstraint('Boards', 'boards_userId_fkey');
    await queryInterface.removeConstraint('Cards', 'cards_listId_fkey');
    await queryInterface.removeConstraint('Lists', 'lists_boardId_fkey');
  }
};
