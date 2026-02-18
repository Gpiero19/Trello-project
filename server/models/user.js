'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Board, { 
        foreignKey: 'userId',
        as: 'boards'
      });
      User.hasMany(models.Card, { 
        foreignKey: 'userId',
        as: 'createdCards'
      });
      User.hasMany(models.Comment, {
        foreignKey: 'userId',
        as: 'comments'
      });
      User.hasMany(models.Template, {
        foreignKey: 'userId',
        as: 'templates'
      });
    };
  }
  
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users'
  });
  return User;
};
