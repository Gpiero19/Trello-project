const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const boardsRoutes = require('/routes/boardRoutes')
require('dotenv').config();

const app = express();

app.use(express.json()); // so you can send JSON bodies

const PORT = 3000;

app.use(cors());
app.use(express.json());

// PostgreSQL pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Basic route
app.get('/', (req, res) => {
  res.send('Express server is running!');
});

// Test database route
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database connection error');
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});

// Route to create a user
app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    res.json(result.rows[0]); // return the new user
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating user');
  }
});

app.use('/boards', boardsRoutes) //Route
