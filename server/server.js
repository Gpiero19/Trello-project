require('dotenv').config();

const express = require('express');
const cors = require('cors');
<<<<<<< HEAD
const db = require('./models');   //sequelize initialize

const authRoutes = require('./routes/auth')
=======
const { Pool } = require('pg');
const authRoutes = require('./routes/auth')

>>>>>>> 2edc3959718c08e4758e2180a0ab390530004f95
const boardsRoutes = require('./routes/boardRoutes');
const listsRoutes = require('./routes/listRoutes');
const cardsRoutes = require('./routes/cardRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
<<<<<<< HEAD
  origin: 'http://localhost:5173', 
=======
  origin: 'http://localhost:5173', // replace with your frontend port
>>>>>>> 2edc3959718c08e4758e2180a0ab390530004f95
  credentials: true
}));

app.use(express.json());  // Parse JSON bodies

<<<<<<< HEAD
=======
// PostgreSQL pool setup
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

>>>>>>> 2edc3959718c08e4758e2180a0ab390530004f95
// Basic root route
app.get('/', (req, res) => {
  res.send('Express server is running!');
});

<<<<<<< HEAD
=======
// Test database connection route
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database connection error');
  }
});

// Route to create a user (you might want to move this to a controller later)
app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating user');
  }
});

>>>>>>> 2edc3959718c08e4758e2180a0ab390530004f95
// Use your routes with base paths
app.use('/api/auth', authRoutes)
app.use('/api/boards', boardsRoutes);
app.use('/api/lists', listsRoutes);
app.use('/api/cards', cardsRoutes);
app.use('/api/users', userRoutes);

<<<<<<< HEAD
db.sequelize.authenticate()
  .then(() => console.log('Database connected.'))
  .catch(err => console.log('Error: ' + err))

  // Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
=======
// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
>>>>>>> 2edc3959718c08e4758e2180a0ab390530004f95
