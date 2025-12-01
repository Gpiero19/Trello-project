'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Board extends Model {
    static associate(models) {
      Board.belongsTo(models.User, { foreignKey: 'userId' });
      Board.hasMany(models.List, { foreignKey: 'boardId' });
    }
  }

  Board.init({
    title: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    guestId: DataTypes.INTEGER,
    position: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    }  }, {
    sequelize,
    modelName: 'Board',
  });
  return Board;
};

