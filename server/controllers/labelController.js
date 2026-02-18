const { Label, Card, CardLabel, Board, List } = require('../models');
const { AppError, asyncHandler } = require('../middleware/errorHandler');
const { ok, created, notFound, forbidden, serverError } = require('../middleware/responseFormatter');

// Create label for a board
exports.createLabel = asyncHandler(async (req, res) => {
  const { boardId, name, color } = req.body;
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
  return created(res, label, 'Label created successfully');
});

// Get all labels for a board
exports.getLabelsByBoard = asyncHandler(async (req, res) => {
  const { boardId } = req.params;
  
  const labels = await Label.findAll({
    where: { boardId: parseInt(boardId) },
    order: [['name', 'ASC']]
  });
  
  return ok(res, labels);
});

// Update label
exports.updateLabel = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, color } = req.body;
  const userId = req.user.id;
  
  const label = await Label.findByPk(id, {
    include: [{ model: Board, as: 'board' }]
  });
  
  if (!label) {
    throw new AppError('Label not found', 404);
  }
  
  // Only board owner can update
  if (label.board.userId !== userId) {
    throw new AppError('Only board owner can update labels', 403);
  }
  
  await label.update({ name, color });
  
  return ok(res, label, 'Label updated successfully');
});

// Delete label
exports.deleteLabel = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  
  const label = await Label.findByPk(id, {
    include: [{ model: Board, as: 'board' }]
  });
  
  if (!label) {
    throw new AppError('Label not found', 404);
  }
  
  // Only board owner can delete
  if (label.board.userId !== userId) {
    throw new AppError('Only board owner can delete labels', 403);
  }
  
  // First delete all CardLabels referencing this label
  await CardLabel.destroy({ where: { labelId: id } });
  
  await label.destroy();
  
  return res.status(204).send();
});
