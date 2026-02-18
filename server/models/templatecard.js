'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TemplateCard extends Model {
    static associate(models) {
      // TemplateCard belongs to TemplateList
      TemplateCard.belongsTo(models.TemplateList, {
        foreignKey: 'templateListId',
        as: 'templateList',
        onDelete: 'CASCADE'
      });
    }
  }

  TemplateCard.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Card title is required' }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    position: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    templateListId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'TemplateList ID is required' }
      }
    }
  }, {
    sequelize,
    modelName: 'TemplateCard',
    tableName: 'TemplateCards',
    indexes: [
      { fields: ['templateListId'], name: 'template_cards_template_list_id_idx' },
      { fields: ['position'], name: 'template_cards_position_idx' }
    ]
  });

  return TemplateCard;
};
