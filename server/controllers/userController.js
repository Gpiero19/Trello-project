const { User } = require('../models');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
      // Check if email already exists (optional but good practice)
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10); //hashing password
    const user = await User.create({ name, email, password: hashedPassword }); //creation of user
    const { password: _, ...userData } = user.toJSON(); 
    res.status(201).json(userData); // Do not return password in the response
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }  //fetch users from DB // hide passwords
        })
        res.status(200).json(users)
    } catch (err) {
        console.error('Error fetching users', err)
        res.status(500).json({error: 'Internal server error'})
    } 
};

exports.getUserById = async (req, res) => {
  const {id} = req.params;
  try {
    const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] }  //fetch users from DB // hide passwords
        });
    if (!user) return res.status(404).json({ error: 'User not found'});
    res.status(200).json(user)
  } catch (err) {
    res.status(500).json({ error: 'User not found'})
  }
}

exports.updateUser = async (req, res) => {
  const {id} = req.params;
  const {name, email, password} = req.body
  
  try {
    const user = await User.findByPk(id)
    if (!user) return res.status(404).json({ error: 'User not found'})

    if (name) user.name = name;
    if (email) user.email = email;
    if (password !== undefined) {
      user.password = await bcrypt.hash(password, 10);
    }
    
    await user.save();
    const { password: _, ...userData } = user.toJSON();

    res.status(200).json(user)
  } catch (err) {
    res.status(500).json({ error: 'Error updating user'})
  }
}

exports.deleteUser = async (req, res) => {
  const {id} = req.params
  try {
    const user = await User.findByPk(id)
    if (!user) return res.status(404).json({ error: 'User not found'})

    await user.destroy()
    res.status(204).send()
  } catch (err) {
    res.status(500).json({error: 'Error deleting user'})
  }
}; 