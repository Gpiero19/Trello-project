'use strict';
const {Model, Op} = require('sequelize');

const PRIORITY_ENUM = ['low', 'medium', 'high', 'urgent'];

module.exports = (sequelize, DataTypes) => {
  class Card extends Model {
    static associate(models) {
      // Card belongs to List (creator of the card)
      Card.belongsTo(models.List, { 
        foreignKey: 'listId', 
        as: 'list',
        onDelete: 'CASCADE' 
      });
      
      // Card assigned to a user
      Card.belongsTo(models.User, { 
        as: 'assignedUser', 
        foreignKey: 'assignedUserId' 
      });
      
      // Card created by user
      Card.belongsTo(models.User, { 
        as: 'creator', 
        foreignKey: 'userId' 
      });
      
      // Card has many Comments (cascade delete)
      Card.hasMany(models.Comment, { 
        foreignKey: 'cardId', 
        as: 'comments',
        onDelete: 'CASCADE' 
      });
      
      // Card belongs to many Labels through CardLabels
      Card.belongsToMany(models.Label, { 
        through: models.CardLabel, 
        foreignKey: 'cardId',
        otherKey: 'labelId',
        as: 'labels'
      });
    }
    
    // Business logic methods
    isOverdue() {
      if (!this.dueDate || this.isCompleted) return false;
      return new Date(this.dueDate) < new Date();
    }
    
    isDueToday() {
      if (!this.dueDate) return false;
      const today = new Date();
      const dueDate = new Date(this.dueDate);
      return dueDate.toDateString() === today.toDateString();
    }
    
    isDueThisWeek() {
      if (!this.dueDate) return false;
      const today = new Date();
      const dueDate = new Date(this.dueDate);
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      return dueDate > today && dueDate <= weekFromNow;
    }
    
    static async getNextPosition(listId) {
      const maxPosition = await this.max('position', { where: { listId } });
      return Number.isFinite(maxPosition) ? maxPosition + 1 : 0;
    }
  }
  
  Card.init({
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Title is required' },
        len: { args: [1, 255], msg: 'Title must be between 1 and 255 characters' }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: { args: [0, 5000], msg: 'Description must not exceed 5000 characters' }
      }
    },
    priority: {
      type: DataTypes.ENUM(PRIORITY_ENUM),
      defaultValue: 'medium',
      validate: {
        isIn: { args: [PRIORITY_ENUM], msg: 'Priority must be: low, medium, high, or urgent' }
      }
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: { msg: 'Due date must be a valid date' }
      }
    },
    position: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    listId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'List ID is required' }
      }
    },
    assignedUserId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Card',
    tableName: 'Cards',
    indexes: [
      { fields: ['dueDate'], name: 'cards_due_date_idx' },
      { fields: ['priority'], name: 'cards_priority_idx' },
      { fields: ['listId'], name: 'cards_list_idx' },
      { fields: ['assignedUserId'], name: 'cards_assigned_user_idx' }
    ]
  });
  
  return Card;
};
