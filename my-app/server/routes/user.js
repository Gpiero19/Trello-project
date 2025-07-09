const express = require('express');
const { User } = require('./models'); // adjust the path if needed
const app = express();
app.use(express.json());

app.post('/users', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = await User.create({ name, email, password });
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating user' });
  }
});
