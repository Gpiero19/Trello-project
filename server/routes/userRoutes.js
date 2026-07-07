const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUser, validateUserUpdate } = require('../middleware/validation');
const authenticateToken = require('../middleware/authMiddleware');
const { requireSelf } = require('../middleware/authorization');

router.post('/', validateUser, userController.createUser);
router.get('/', authenticateToken, userController.getAllUsers);
router.get('/:id', authenticateToken, requireSelf, userController.getUserById);
router.put('/:id', authenticateToken, requireSelf, validateUserUpdate, userController.updateUser);
router.delete('/:id', authenticateToken, requireSelf, userController.deleteUser);

module.exports = router;
