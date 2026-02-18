'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Template extends Model {
    static associate(models) {
      // Template belongs to User (nullable - null = system template)
      Template.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });

      // Template has many TemplateLists
      Template.hasMany(models.TemplateList, {
        foreignKey: 'templateId',
        as: 'lists',
        onDelete: 'CASCADE'
      });
    }
  }

  Template.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Template name is required' }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true // null = system template
    }
  }, {
    sequelize,
    modelName: 'Template',
    tableName: 'Templates',
    indexes: [
      { fields: ['userId'], name: 'templates_user_id_idx' },
      { fields: ['isPublic'], name: 'templates_is_public_idx' }
    ]
  });

  return Template;
};
