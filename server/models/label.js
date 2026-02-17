'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Label extends Model {
    static associate(models) {
      // Label belongs to Board
      Label.belongsTo(models.Board, { 
        foreignKey: 'boardId', 
        as: 'board' 
      });
      
      // Label has many CardLabels
      Label.hasMany(models.CardLabel, { 
        foreignKey: 'labelId' 
      });
      
      // Label belongs to many Cards through CardLabel
      Label.belongsToMany(models.Card, { 
        through: models.CardLabel, 
        foreignKey: 'labelId',
        otherKey: 'cardId',
        as: 'cards'
      });
    }
  }
  
  Label.init({
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Label name is required' },
        len: { args: [1, 50], msg: 'Label name must be between 1 and 50 characters' }
      }
    },
    color: {
      type: DataTypes.STRING(7),
      allowNull: false,
      validate: {
        isHexColor: /^#[0-9A-Fa-f]{6}$/
      }
    },
    boardId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'Board ID is required' }
      }
    }
  }, {
    sequelize,
    modelName: 'Label',
    tableName: 'Labels',
    indexes: [
      { fields: ['boardId'], name: 'labels_board_idx' }
    ]
  });
  
  return Label;
};
