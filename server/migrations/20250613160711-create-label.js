'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Labels', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Label name is required' },
          len: { args: [1, 50], msg: 'Label name must be between 1 and 50 characters' }
        }
      },
      color: {
        type: Sequelize.STRING(7), // Hex color
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Color is required' }
        }
      },
      boardId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Boards',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
    
    await queryInterface.addIndex('Labels', ['boardId'], { name: 'labels_board_idx' });
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Labels');
  }
};
