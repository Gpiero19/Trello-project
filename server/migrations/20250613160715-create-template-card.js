'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TemplateCards', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      position: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      templateListId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'TemplateLists',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }
    });

    // Add indexes
    await queryInterface.addIndex('TemplateCards', ['templateListId']);
    await queryInterface.addIndex('TemplateCards', ['position']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TemplateCards');
  }
};
