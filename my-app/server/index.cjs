'use strict';

const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./db.cjs');  // Make sure to use .cjs extension for CommonJS files

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

// connect to Postgres
sequelize.authenticate().then(() => {
  console.log('✅ Connected to Postgres!');
}).catch((error) => {
  console.error('❌ Unable to connect to the database:', error);
});
