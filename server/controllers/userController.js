const { User } = require('../models');
const bcrypt = require('bcrypt');
const { ok, created, notFound, badRequest, serverError } = require('../middleware/responseFormatter');

exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return badRequest(res, 'Email already in use', 'A user with this email already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    const { password: _, ...userData } = user.toJSON(); 
    return created(res, userData, 'User created successfully');
  } catch (err) {
    console.error('Error creating user:', err);
    return serverError(res, 'Failed to create user');
  }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        return ok(res, users);
    } catch (err) {
        console.error('Error fetching users', err);
        return serverError(res, 'Failed to fetch users');
    } 
};

exports.getUserById = async (req, res) => {
  const {id} = req.params;
  try {
    const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] }
        });
    if (!user) return notFound(res, 'User not found', 'No user found with this ID');
    return ok(res, user);
  } catch (err) {
    return serverError(res, 'Failed to fetch user');
  }
};

exports.updateUser = async (req, res) => {
  const {id} = req.params;
  const {name, email, password} = req.body;
  
  try {
    const user = await User.findByPk(id);
    if (!user) return notFound(res, 'User not found', 'No user found with this ID');

    if (name) user.name = name;
    if (email) user.email = email;
    if (password !== undefined) {
      user.password = await bcrypt.hash(password, 10);
    }
    
    await user.save();
    const { password: _, ...userData } = user.toJSON();

    return ok(res, userData, 'User updated successfully');
  } catch (err) {
    return serverError(res, 'Failed to update user');
  }
};

exports.deleteUser = async (req, res) => {
  const {id} = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) return notFound(res, 'User not found', 'No user found with this ID');

    await user.destroy();
    return res.status(204).send();
  } catch (err) {
    return serverError(res, 'Failed to delete user');
  }
}; 
