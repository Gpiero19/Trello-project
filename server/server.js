require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const db = require('./models');   //sequelize initialize
const { errorHandler } = require('./middleware/errorHandler');
const { sequelize } = require('./models');

const authRoutes = require('./routes/auth')
const boardsRoutes = require('./routes/boardRoutes');
const listsRoutes = require('./routes/listRoutes');
const cardsRoutes = require('./routes/cardRoutes');
const userRoutes = require('./routes/userRoutes');
const labelRoutes = require('./routes/labelRoutes');
const templateRoutes = require('./routes/templateRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS - allow requests from frontend
const corsOptions = {
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    // Get allowed origins
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const allowedOrigins = [
      'http://localhost:5173',
      frontendUrl,
      frontendUrl?.replace(/\/$/, '') // without trailing slash
    ].filter(Boolean);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

// Middleware
app.use(cors(corsOptions));

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
  .then(() => {
    console.log('Database connected.');
    // Run migrations automatically
    exec('npx sequelize-cli db:migrate', (error, stdout, stderr) => {
      if (error) {
        console.log('Migration error:', stderr);
      } else {
        console.log('Migrations completed:', stdout);
      }
    });
  })
  .catch(err => console.log('Error: ' + err))

  // Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
