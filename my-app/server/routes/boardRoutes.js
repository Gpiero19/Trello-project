const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');

router.post('/', boardController.createBoard); //Post api/boards
router.get('/', boardController.getAllBoards); //Fetch api/boards
router.get('/:id', boardController.getBoardById); //Fetch api/boards by ID
router.put('/', boardController.updateBoard); //Update api/boards by ID
router.delete('/:id', boardController.deleteBoard); //Delete api/boards


module.exports = router;
