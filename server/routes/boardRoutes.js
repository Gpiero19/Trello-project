const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');
const labelController = require('../controllers/labelController');
const authenticateToken = require('../middleware/authMiddleware');
const { validateBoard, validateBoardUpdate, validateBoardReorder } = require('../middleware/validation');

router.post("/", authenticateToken, validateBoard, boardController.createBoard);
router.get('/', authenticateToken, boardController.getAllBoards);
router.put('/reorder', authenticateToken, validateBoardReorder, boardController.reorderBoards);
router.put('/:id', authenticateToken, validateBoardUpdate, boardController.updateBoard);
router.get('/:id', authenticateToken, boardController.getBoardById);
router.delete('/:id', authenticateToken, boardController.deleteBoard);

// Labels routes
router.get('/:boardId/labels', authenticateToken, labelController.getLabelsByBoard);
router.post('/:boardId/labels', authenticateToken, labelController.createLabel);

module.exports = router;
