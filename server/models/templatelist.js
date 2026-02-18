'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TemplateList extends Model {
    static associate(models) {
      // TemplateList belongs to Template
      TemplateList.belongsTo(models.Template, {
        foreignKey: 'templateId',
        as: 'template'
      });

      // TemplateList has many TemplateCards
      TemplateList.hasMany(models.TemplateCard, {
        foreignKey: 'templateListId',
        as: 'cards',
        onDelete: 'CASCADE'
      });
    }
  }

  TemplateList.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'List title is required' }
      }
    },
    position: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    templateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'Template ID is required' }
      }
    }
  }, {
    sequelize,
    modelName: 'TemplateList',
    tableName: 'TemplateLists',
    indexes: [
      { fields: ['templateId'], name: 'template_lists_template_id_idx' },
      { fields: ['position'], name: 'template_lists_position_idx' }
    ]
  });

  return TemplateList;
};
