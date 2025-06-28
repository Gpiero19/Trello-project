'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class List extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      List.associate = function(models) {
        List.belongsTo(models.Board, { foreignKey: 'boardId' });
        List.hasMany(models.Card, { foreignKey: 'cardId' });
    }
    }
  }
  List.init({
    title: DataTypes.STRING,
    boardId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'List',
  });
  return List;
};