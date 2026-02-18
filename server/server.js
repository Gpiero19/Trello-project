require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./models');   //sequelize initialize
const { errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth')
const boardsRoutes = require('./routes/boardRoutes');
const listsRoutes = require('./routes/listRoutes');
const cardsRoutes = require('./routes/cardRoutes');
const userRoutes = require('./routes/userRoutes');
const labelRoutes = require('./routes/labelRoutes');
const templateRoutes = require('./routes/templateRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));

app.use(express.json());  // Parse JSON bodies

// Basic root route
app.get('/', (req, res) => {
  res.send('Express server is running!');
});

// Use your routes with base paths
app.use('/api/auth', authRoutes)
app.use('/api/boards', boardsRoutes);
app.use('/api/lists', listsRoutes);
app.use('/api/cards', cardsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/labels', labelRoutes);
app.use('/api/templates', templateRoutes);

// Centralized error handler
app.use(errorHandler);

db.sequelize.authenticate()
  .then(() => console.log('Database connected.'))
  .catch(err => console.log('Error: ' + err))

  // Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
