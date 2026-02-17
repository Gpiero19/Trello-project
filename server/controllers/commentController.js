const { Comment, Card, User, Board, List } = require('../models');
const { AppError, asyncHandler } = require('../middleware/errorHandler');

// Delete comment
exports.deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  
  const comment = await Comment.findByPk(id, {
    include: [
      { model: Card, include: [{ model: List, include: [{ model: Board }] }] },
      { model: User, as: 'author' }
    ]
  });
  
  if (!comment) {
    throw new AppError('Comment not found', 404);
  }
  
  // Authorization: comment owner OR board owner
  const isCommentOwner = comment.userId === userId;
  const isBoardOwner = comment.Card.List.Board.userId === userId;
  
  if (!isCommentOwner && !isBoardOwner) {
    throw new AppError('Not authorized to delete this comment', 403);
  }
  
  await comment.destroy();
  
  res.status(204).send();
});

// Update comment
exports.updateComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user.id;
  
  const comment = await Comment.findByPk(id);
  
  if (!comment) {
    throw new AppError('Comment not found', 404);
  }
  
  // Only comment owner can update
  if (comment.userId !== userId) {
    throw new AppError('Not authorized to update this comment', 403);
  }
  
  await comment.update({ content });
  
  const updatedComment = await Comment.findByPk(id, {
    include: [{ model: User, as: 'author', attributes: ['id', 'name', 'email'] }]
  });
  
  res.status(200).json(updatedComment);
});
