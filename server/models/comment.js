'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      // Comment belongs to User (author)
      Comment.belongsTo(models.User, { 
        as: 'author', 
        foreignKey: 'userId' 
      });
      
      // Comment belongs to Card
      Comment.belongsTo(models.Card, { 
        foreignKey: 'cardId', 
        as: 'card' 
      });
    }
  }
  
  Comment.init({
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Comment content is required' },
        len: { args: [1, 2000], msg: 'Comment must not exceed 2000 characters' }
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'User ID is required' }
      }
    },
    cardId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'Card ID is required' }
      }
    }
  }, {
    sequelize,
    modelName: 'Comment',
    tableName: 'Comments',
    indexes: [
      { fields: ['cardId'], name: 'comments_card_idx' },
      { fields: ['userId'], name: 'comments_user_idx' }
    ]
  });
  
  return Comment;
};
