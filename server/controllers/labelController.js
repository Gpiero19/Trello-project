const { Label, Card, CardLabel, Board, List } = require('../models');
const { AppError, asyncHandler } = require('../middleware/errorHandler');

// Create label for a board
exports.createLabel = asyncHandler(async (req, res) => {
  const { boardId } = req.params;
  const { name, color } = req.body;
  const userId = req.user.id;
  
  // Verify board exists and user is owner
  const board = await Board.findByPk(boardId);
  if (!board) {
    throw new AppError('Board not found', 404);
  }
  
  if (board.userId !== userId) {
    throw new AppError('Only board owner can create labels', 403);
  }
  
  const label = await Label.create({ name, color, boardId: parseInt(boardId) });
  res.status(201).json(label);
});

// Get all labels for a board
exports.getLabelsByBoard = asyncHandler(async (req, res) => {
  const { boardId } = req.params;
  
  const labels = await Label.findAll({
    where: { boardId: parseInt(boardId) },
    order: [['name', 'ASC']]
  });
  
  res.status(200).json(labels);
});

// Update label
exports.updateLabel = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, color } = req.body;
  const userId = req.user.id;
  
  const label = await Label.findByPk(id, {
    include: [{ model: Board }]
  });
  
  if (!label) {
    throw new AppError('Label not found', 404);
  }
  
  // Only board owner can update
  if (label.Board.userId !== userId) {
    throw new AppError('Only board owner can update labels', 403);
  }
  
  await label.update({ name, color });
  
  res.status(200).json(label);
});

// Delete label
exports.deleteLabel = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  
  const label = await Label.findByPk(id, {
    include: [{ model: Board }]
  });
  
  if (!label) {
    throw new AppError('Label not found', 404);
  }
  
  // Only board owner can delete
  if (label.Board.userId !== userId) {
    throw new AppError('Only board owner can delete labels', 403);
  }
  
  await label.destroy();
  
  res.status(204).send();
});
