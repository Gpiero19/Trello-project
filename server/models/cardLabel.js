'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CardLabel extends Model {
    static associate(models) {
      CardLabel.belongsTo(models.Card, { foreignKey: 'cardId' });
      CardLabel.belongsTo(models.Label, { foreignKey: 'labelId' });
    }
  }
  
  CardLabel.init({
    cardId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: { model: 'Cards', key: 'id' }
    },
    labelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: { model: 'Labels', key: 'id' }
    }
  }, {
    sequelize,
    modelName: 'CardLabel',
    tableName: 'CardLabels',
    indexes: [
      { fields: ['cardId'], name: 'card_labels_card_idx' },
      { fields: ['labelId'], name: 'card_labels_label_idx' }
    ],
    uniqueKeys: {
      unique_card_label: {
        fields: ['cardId', 'labelId']
      }
    }
  });
  
  return CardLabel;
};
