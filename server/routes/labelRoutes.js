const express = require('express');
const router = express.Router();
const labelController = require('../controllers/labelController');
const { validateLabel } = require('../middleware/validation');
const { authenticate, authorizeBoardMember } = require('../middleware/authorization');
const authenticateToken = require('../middleware/authMiddleware');

// POST /labels - Create label
router.post('/', authenticateToken, validateLabel, labelController.createLabel);

// GET /labels/:boardId - Get all labels for board
router.get('/:boardId', authenticateToken, labelController.getLabelsByBoard);

// PUT /labels/:id - Update label
router.put('/:id', authenticateToken, validateLabel, labelController.updateLabel);

// DELETE /labels/:id - Delete label
router.delete('/:id', authenticateToken, labelController.deleteLabel);

module.exports = router;
