const { Board } = require('../models');

exports.createBoard = async (req, res) => {
  try {
    const { title, userId } = req.body;
    const board = await Board.create({ title, userId }); //creation of board name

    res.status(201).json(board);

  } catch (err) {
    console.error('Error creating board:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllBoards = async (req, res) => {
    try {
        const boards = await Board.findAll(); //fetch boards from DB
        res.status(200).json(boards)
    } catch (err) {
        console.error('Error fetching boards', err)
        res.status(500).json({error: 'Internal server error'})
    }
};