const { Board, List, Card } = require('../models');

exports.createBoard = async (req, res) => {
  try {
    const userId = req.user?.id; 
    const { title, guestId } = req.body; 

    if (!userId && !guestId) {
      return res.status(400).json({ error: "Must provide either userId or guestId" });
    }

    // Determine max position for ordering
    const maxPosition = await Board.max('position', { 
      where: userId ? { userId } : { guestId } 
    });
    const position = Number.isFinite(maxPosition) ? maxPosition + 1 : 0;

    const board = await Board.create({ title, userId, guestId, position });

    res.status(201).json(board);
  } catch (err) {
    console.error('Error creating board:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllBoards = async (req, res) => {
<<<<<<< HEAD
=======
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
  const {id} = req.params
  const userId = req.user.id

  // console.log("Board ID:", id);
  console.log("here we are ", id)
  // console.log("Authenticated user ID:", userId);

>>>>>>> parent of a8dbd4b (Reorder - drag n drop fixed)
  try {
    const userId = req.user?.id || null;
    const guestId = req.query.guestId || null;

    const boards = await Board.findAll({
      where: userId ? { userId } : { guestId },
      include: [
        {
          model: List,
<<<<<<< HEAD
          as: 'lists',
          separate: true,
          order: [['position', 'ASC']],
          include: [
            {
              model: Card,
              as: 'cards',
              separate: true,
              order: [['position', 'ASC']]
            }
          ]
        }
      ],
      order: [['position', 'ASC']]
    });

    res.status(200).json(boards);
  } catch (err) {
    console.error('Error fetching boards', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getBoardById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id || null;
  const guestId = req.query.guestId || null;

  try {
    const board = await Board.findOne({
      where: { id, ...(userId ? { userId } : { guestId }) },
      include: [
        {
          model: List,
          as: 'lists',
          separate: true,
          order: [['position', 'ASC']],
          include: [
            {
              model: Card,
              as: 'cards',
              separate: true,
              order: [['position', 'ASC']]
=======
          include: [
            {
              model: Card,
              order: [["position", "ASC"]]
>>>>>>> parent of a8dbd4b (Reorder - drag n drop fixed)
            }
          ]
        }
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
  const { title, userId, guestId } = req.body;

  try {
    const board = await Board.findByPk(id);
    if (!board) return res.status(404).json({ error: 'Board not found' });

    if (title !== undefined) board.title = title;
    if (userId !== undefined) board.userId = userId;
    if (guestId !== undefined) board.guestId = guestId;

    await board.save();
    res.status(200).json(board);
  } catch (err) {
    console.error('Error updating board:', err);
    res.status(500).json({ error: 'Error updating board' });
  }
};

exports.deleteBoard = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id || null;
  const guestId = req.query.guestId || null;

  try {
    const board = await Board.findOne({
      where: { id, ...(userId ? { userId } : { guestId }) }
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
    const { boards, guestId } = req.body;
    const userId = req.user?.id || null;

    const updates = boards.map(({ id, position }) => {
      return Board.update(
        { position },
        { where: { id, ...(userId ? { userId } : { guestId }) } }
      );
    });

    await Promise.all(updates);
    res.status(200).json({ message: 'Boards reordered successfully' });
  } catch (err) {
    console.error('Error reordering boards', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.claimGuestBoards = async (req, res) => {
  const { guestId, newUserId } = req.body;
  try {
    const boards = await Board.findAll({ where: { guestId } });
    if (!boards.length) return res.status(404).json({ message: "No guest boards found" });

    const updates = boards.map(b => Board.update({ userId: newUserId, guestId: null }, { where: { id: b.id } }));
    await Promise.all(updates);

    res.status(200).json({ message: "Guest boards successfully claimed" });
  } catch (err) {
    console.error("Error claiming guest boards:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
