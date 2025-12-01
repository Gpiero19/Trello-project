'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Card extends Model {
    static associate(models) {
        Card.belongsTo(models.User, { foreignKey: 'userId' });
        Card.belongsTo(models.List, { foreignKey: 'listId', as: 'list' });
    }
  }
  
  Card.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    position: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    listId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Card',
  });
  return Card;
};