import express from 'express';
import dotenv from 'dotenv';
import sequelize from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Trello clone backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// connect to Postgres npx nodemon index.js