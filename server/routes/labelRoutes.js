const express = require('express');
const router = express.Router();
const labelController = require('../controllers/labelController');
const { validateLabel } = require('../middleware/validation');
const { authenticate, authorizeBoardMember } = require('../middleware/authorization');
const authenticateToken = require('../middleware/authMiddleware');

// POST /boards/:boardId/labels - Create label
router.post('/boards/:boardId/labels', authenticateToken, validateLabel, labelController.createLabel);

// GET /boards/:boardId/labels - Get all labels for board
router.get('/boards/:boardId/labels', authenticateToken, labelController.getLabelsByBoard);

// PUT /labels/:id - Update label
router.put('/labels/:id', authenticateToken, validateLabel, labelController.updateLabel);

// DELETE /labels/:id - Delete label
router.delete('/labels/:id', authenticateToken, labelController.deleteLabel);

module.exports = router;
