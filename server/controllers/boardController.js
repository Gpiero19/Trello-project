const { Board, List, Card } = require('../models');

exports.createBoard = async (req, res) => {
  try {
    const userId = req.user?.id; 
    const { title } = req.body; 

    if (!userId) {
      return res.status(400).json({ error: "Must provide userId" });
    }

    const maxPosition = await Board.max('position', { where: { userId } });
    const position = Number.isFinite(maxPosition) ? maxPosition + 1 : 0;

    const board = await Board.create({ title, userId, position });
    res.status(201).json(board);
  } catch (err) {
    console.error('Error creating board:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllBoards = async (req, res) => {
    try {
      const userId = req.user?.id
      const boards = await Board.findAll( {where: {userId}}); //fetch boards of user
      res.status(200).json(boards)

    } catch (err) {
        console.error('Error fetching boards', err)
        res.status(500).json({error: 'Internal server error'})
    } 
};

exports.getBoardById = async (req, res) => {
  const {id} = req.params
  const userId = req.user?.id

  console.log("Authenticated user ID:", userId);

  try {
    const board = await Board.findOne({
      where: { id, userId },
      include: [
        {
          model: List,
          include: [
            {
              model: Card,
            }
          ]
        }
      ],
        order: [
    [{ model: List, as: 'Lists' }, 'position', 'ASC'],
    [{ model: List, as: 'Lists' }, { model: Card, as: 'Cards' }, 'position', 'ASC']
  ]
    });

    if (!board) return res.status(404).json({ error: 'Board not found' });

    res.status(200).json(board);
  } catch (err) {
    console.error('Error fetching board:', err);
    res.status(500).json({ error: 'Board not found' });
  }
};

exports.updateBoard = async (req, res) => {
  const { id } = req.params;
  const { title, userId } = req.body;

  try {
    const board = await Board.findByPk(id);
    if (!board) return res.status(404).json({ error: 'Board not found' });

    if (title !== undefined) board.title = title;
    if (userId !== undefined) board.userId = userId;

    await board.save();
    res.status(200).json(board);
  } catch (err) {
    console.error('Error updating board:', err);
    res.status(500).json({ error: 'Error updating board' });
  }
};

exports.deleteBoard = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const board = await Board.findOne({
      where: { id, userId }
    });
    if (!board) return res.status(404).json({ error: 'Board not found' });

    await board.destroy();
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting board:', err);
    res.status(500).json({ error: 'Error deleting board' });
  }
};

exports.reorderBoards = async (req, res) => {
  try {
    const { boards } = req.body;
    const userId = req.user?.id;

    const updates = boards.map(({ id, position }) => {
      return Board.update(
        { position },
        { where: { id, userId } }
      );
    });

    await Promise.all(updates);
    res.status(200).json({ message: 'Boards reordered successfully' });
  } catch (err) {
    console.error('Error reordering boards', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// Needs to be added after creating guest ID
// exports.claimGuestBoards = async (req, res) => {

//   try {
//     const boards = await Board.findAll({ where: { userId: req.body.userId } });
//     if (!boards.length) return res.status(404).json({ message: "No guest boards found" });

//     const updates = boards.map(b => Board.update({ userId: req.body.userId }, { where: { id: b.id } }));
//     await Promise.all(updates);

//     res.status(200).json({ message: "Guest boards successfully claimed" });
//   } catch (err) {
//     console.error("Error claiming guest boards:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
