const { Board, List, Card } = require('../models');

exports.createBoard = async (req, res) => {
  try {
    const userId = req.user.id
    const { title } = req.body;
    const maxPosition = await List.max('position', { where: { userId } });
    const position = Number.isFinite(maxPosition) ? maxPosition + 1 : 0;
    
    const board = await Board.create({ title, userId, position }); //creation of board name

    res.status(201).json(board);
  } catch (err) {
    console.error('Error creating board:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllBoards = async (req, res) => {
    try {
      const userId = req.user.id
      const boards = await Board.findAll( {where: {userId}}); //fetch boards of user
      res.status(200).json(boards)

    } catch (err) {
        console.error('Error fetching boards', err)
        res.status(500).json({error: 'Internal server error'})
    } 
};

exports.getBoardById = async (req, res) => {
  const {id} = req.params;
  const userId = req.user.id

  // console.log("Board ID:", id);
  console.log("here we are ")
  // console.log("Authenticated user ID:", userId);

  try {
    const board = await Board.findOne({
      where: {id, userId},
      include: [{
        model: List,
        include: [Card]
      }],
      order:[
        [{model: List}, 'position', 'ASC']
        [{model: List}, {model: Card}, 'position', 'ASC']
      ]
    });

    if (!board) return res.status(404).json({ error: 'Board not found'});

    res.status(200).json(board)
  } catch (err) {
    res.status(500).json({ error: 'Board not found'})
  }
}

exports.updateBoard = async (req, res) => {
  const {id} = req.params;
  const {title, userId} = req.body
  try {
    const board = await Board.findByPk(id)
    if (!board) return res.status(404).json({ error: 'Board not found'})
    
    if (title !== undefined) board.title = title;
    if (userId !== undefined) board.userId = userId;

    await board.save();
    res.status(200).json(board)
  } catch (err) {
    res.status(500).json({ error: 'Error updating board'})
  }
}

exports.deleteBoard = async (req, res) => {
  const {id} = req.params
  try {
    const board = await Board.findByPk(id)
    if (!board) return res.status(404).json({ error: 'Board not found'})

    await board.destroy()
    res.status(204).send()
  } catch (err) {
    res.status(500).json({error: 'Error deleting board'})
  }
}; 