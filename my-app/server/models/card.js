'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Card extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Card.associate = function(models) {
        Card.belongsTo(models.User, { foreignKey: 'userId' });
        Card.belongsTo(models.List, { foreignKey: 'Id' });
    }
    }
  }
  Card.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    listId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Card',
  });
  return Card;
};