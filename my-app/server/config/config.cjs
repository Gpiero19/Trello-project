const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  development: {
    use_env_variable: 'DB_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
