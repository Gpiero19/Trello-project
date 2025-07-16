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

exports.getBoardById = async (req, res) => {
  const {id} = req.params;
  try {
    const board = await Board.findByPK(id);
    if (!board) return res.status(404).json({ error: 'Board not found'});
    res.status(200).json(board)
  } catch (err) {
    res.status(500).json({ error: 'Board not found'})
  }
}

exports.updateBoard = async (req, res) => {
  const {id} = req.params;
  const {title} = req.body
  try {
    const board = await Board.findByPK(id)
    if (!board) return res.status(404).json({ error: 'Board not found'})
    
    board.title = title
    await board.save();

    res.status(200).json(board)
  } catch (err) {
    res.status(500).json({ error: 'Error updating board'})
  }
}

exports.deleteBoard = async (req, res) => {
  const {id} = req.params
  try {
    const board = await Board.findByPK(id)
    if (!board) return res.status(404).json({ error: 'Board not found'})

    await board.destroy()
    res.status(204).send()
  } catch (err) {
    res.status(500).json({error: 'Error deleting board'})
  }
}; 