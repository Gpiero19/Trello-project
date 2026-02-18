const { Board, List, Card, Label, Comment, User } = require('../models');
const { ok, created, notFound, badRequest, serverError } = require('../middleware/responseFormatter');

exports.createBoard = async (req, res) => {
  try {
    const userId = req.user?.id; 
    const { title, description } = req.body; 

    if (!userId) {
      return badRequest(res, 'User ID required', 'Must provide userId');
    }

    const maxPosition = await Board.max('position', { where: { userId } });
    const position = Number.isFinite(maxPosition) ? maxPosition + 1 : 0;

    const board = await Board.create({ title, description, userId, position });
    return created(res, board, 'Board created successfully');
  } catch (err) {
    console.error('Error creating board:', err);
    return serverError(res, 'Failed to create board');
  }
};

exports.getAllBoards = async (req, res) => {
    try {
      const userId = req.user?.id;
      const boards = await Board.findAll({
        where: { userId },
        include: [
          {
            model: List,
            as: 'Lists',
            include: [
              {
                model: Card,
                as: 'Cards'
              }
            ]
          }
        ],
        order: [['position', 'ASC']]
      });
      return ok(res, boards);
    } catch (err) {
        console.error('Error fetching boards', err);
        return serverError(res, 'Failed to fetch boards');
    } 
};

exports.getBoardById = async (req, res) => {
  const {id} = req.params;
  const userId = req.user?.id;

  try {
    const board = await Board.findOne({
      where: { id, userId },
      include: [
        {
          model: List,
          as: 'Lists',
          include: [
            {
              model: Card,
              as: 'Cards',
              include: [
                { model: Label, as: 'labels', through: { attributes: [] } },
                { model: Comment, as: 'comments', include: [{ model: User, as: 'author', attributes: ['id', 'name'] }] }
              ]
            }
          ]
        }
      ],
      order: [
        [{ model: List, as: 'Lists' }, 'position', 'ASC'],
        [{ model: List, as: 'Lists' }, { model: Card, as: 'Cards' }, 'position', 'ASC']
      ]
    });

    if (!board) return notFound(res, 'Board not found', 'No board found with this ID');
    return ok(res, board);
  } catch (err) {
    console.error('Error fetching board:', err);
    return serverError(res, 'Failed to fetch board');
  }
};

exports.updateBoard = async (req, res) => {
  const { id } = req.params;
  const { title, description, userId } = req.body;

  try {
    const board = await Board.findByPk(id);
    if (!board) return notFound(res, 'Board not found', 'No board found with this ID');

    if (title !== undefined) board.title = title;
    if (description !== undefined) board.description = description;
    if (userId !== undefined) board.userId = userId;

    await board.save();
    return ok(res, board, 'Board updated successfully');
  } catch (err) {
    console.error('Error updating board:', err);
    return serverError(res, 'Failed to update board');
  }
};

exports.deleteBoard = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const board = await Board.findOne({
      where: { id, userId }
    });
    if (!board) return notFound(res, 'Board not found', 'No board found with this ID');

    await board.destroy();
    return res.status(204).send();
  } catch (err) {
    console.error('Error deleting board:', err);
    return serverError(res, 'Failed to delete board');
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
    return ok(res, null, 'Boards reordered successfully');
  } catch (err) {
    console.error('Error reordering boards', err);
    return serverError(res, 'Failed to reorder boards');
  }
};
