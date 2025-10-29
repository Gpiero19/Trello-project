'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class List extends Model {
    static associate(models) {
      List.belongsTo(models.Board, { foreignKey: 'boardId' });
      List.hasMany(models.Card, { foreignKey: 'cardId' });
    };
  }
  
  List.init({
    title: DataTypes.STRING,
    position: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
      boardId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'List',
  });
  return List;
};