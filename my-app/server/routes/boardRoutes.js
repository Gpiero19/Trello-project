const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/:id', authenticateToken, boardController.getBoardById); //Fetch api/boards by ID

router.post('/', authenticateToken, boardController.createBoard); //Post api/boards
router.get('/', authenticateToken, boardController.getAllBoards); //Fetch api/boards
router.put('/reorder', boardController.reorderBoards);                 //Reorder boards by dragging
router.put('/:id', authenticateToken, boardController.updateBoard); //Update api/boards by ID
router.delete('/:id', authenticateToken, boardController.deleteBoard); //Delete api/boards


module.exports = router;
