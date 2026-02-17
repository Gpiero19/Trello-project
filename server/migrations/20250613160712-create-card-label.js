'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CardLabels', {
      cardId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Cards',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      labelId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Labels',
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
    
    // Composite unique constraint
    await queryInterface.addConstraint('CardLabels', {
      fields: ['cardId', 'labelId'],
      type: 'unique',
      name: 'unique_card_label'
    });
    
    // Indexes for performance
    await queryInterface.addIndex('CardLabels', ['cardId'], { name: 'card_labels_card_idx' });
    await queryInterface.addIndex('CardLabels', ['labelId'], { name: 'card_labels_label_idx' });
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CardLabels');
  }
};
