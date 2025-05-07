'use strict';

const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  development: {
    use_env_variable: 'DB_URL',  // It will take the value of DB_URL from the .env file
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false  // To avoid SSL errors with Railway, for example
      }
    }
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  production: {
    username: 'root',
    password: null,
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'mysql'
  }
};
