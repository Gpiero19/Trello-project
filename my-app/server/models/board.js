'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Board extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Board.associate = function(models) {
        Board.belongsTo(models.User, { foreignKey: 'userId' });
        Board.hasMany(models.List, { foreignKey: 'boardId' });
    }
  }
  }
  Board.init({
    title: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Board',
  });
  return Board;
};