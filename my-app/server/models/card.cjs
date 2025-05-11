'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Card extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Card.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    list_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Card',
  });
  return Card;
};

Card.associate = function (models) {
  Card.belongsTo(models.List, { foreignKey: 'listId'});
  Card.belongsTo(models.User, { foreignKey: 'userId'});
};