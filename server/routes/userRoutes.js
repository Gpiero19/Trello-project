const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUser, validateUserUpdate } = require('../middleware/validation');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/', validateUser, userController.createUser);
router.get('/', authenticateToken, userController.getAllUsers);
router.get('/:id', authenticateToken, userController.getUserById);
router.put('/:id', authenticateToken, validateUserUpdate, userController.updateUser);
router.delete('/:id', authenticateToken, userController.deleteUser);

module.exports = router;
