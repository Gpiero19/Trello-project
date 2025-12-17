'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

const db = {};
let sequelize;

// Initialize Sequelize
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Dynamically import all models in this folder
fs
  .readdirSync(__dirname)
  .filter(file =>
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.slice(-3) === '.js' &&
    !file.endsWith('.test.js')
  )
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Define relationships
db.Board.hasMany(db.List, { foreignKey: 'boardId', onDelete: 'CASCADE' });
db.List.belongsTo(db.Board, { foreignKey: 'boardId' });

db.List.hasMany(db.Card, { foreignKey: 'listId', onDelete: 'CASCADE' });
db.Card.belongsTo(db.List, { foreignKey: 'listId' });

// Attach Sequelize instance
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
