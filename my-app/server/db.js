import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

try {
  await sequelize.authenticate();
  console.log('✅ Connected to Railway Postgres!');
} catch (error) {
  console.error('❌ Unable to connect to the database:', error);
}

export default sequelize;
