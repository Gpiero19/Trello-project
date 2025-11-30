const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', authenticateToken, boardController.getAllBoards);
router.get('/:id', authenticateToken, boardController.getBoardById);
router.put('/:id', authenticateToken, boardController.updateBoard);
router.delete('/:id', authenticateToken, boardController.deleteBoard);
router.put('/reorder', authenticateToken, boardController.reorderBoards);
router.post('/claim-guest-boards', authenticateToken, boardController.claimGuestBoards);

module.exports = router;
