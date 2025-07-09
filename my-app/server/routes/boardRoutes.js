const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');

router.post('/', boardController.createBoard); //Post api/boards
router.get('/', boardController.getAllBoards); //Fetch api/boards

module.exports = router;
