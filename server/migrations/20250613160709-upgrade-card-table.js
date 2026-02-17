'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Add priority ENUM column
    await queryInterface.addColumn('Cards', 'priority', {
      type: Sequelize.ENUM('low', 'medium', 'high', 'urgent'),
      defaultValue: 'medium'
    });
    
    // 2. Add dueDate column
    await queryInterface.addColumn('Cards', 'dueDate', {
      type: Sequelize.DATE,
      allowNull: true
    });
    
    // 3. Add assignedUserId column
    await queryInterface.addColumn('Cards', 'assignedUserId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
    
    // 4. Add isCompleted column
    await queryInterface.addColumn('Cards', 'isCompleted', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
    
    // 5. Add indexes for performance
    await queryInterface.addIndex('Cards', ['dueDate'], { name: 'cards_due_date_idx' });
    await queryInterface.addIndex('Cards', ['priority'], { name: 'cards_priority_idx' });
    await queryInterface.addIndex('Cards', ['assignedUserId'], { name: 'cards_assigned_user_idx' });
    
    // 6. Update title to be required
    await queryInterface.changeColumn('Cards', 'title', {
      type: Sequelize.STRING(255),
      allowNull: false
    });
    
    // 7. Add listId index (if not already exists)
    await queryInterface.addIndex('Cards', ['listId'], { name: 'cards_list_idx' });
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Cards', 'priority');
    await queryInterface.removeColumn('Cards', 'dueDate');
    await queryInterface.removeColumn('Cards', 'assignedUserId');
    await queryInterface.removeColumn('Cards', 'isCompleted');
    
    await queryInterface.removeIndex('Cards', 'cards_due_date_idx');
    await queryInterface.removeIndex('Cards', 'cards_priority_idx');
    await queryInterface.removeIndex('Cards', 'cards_assigned_user_idx');
    await queryInterface.removeIndex('Cards', 'cards_list_idx');
  }
};
