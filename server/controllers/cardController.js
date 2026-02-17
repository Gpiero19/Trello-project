const { Card, List, Board, User, Label, CardLabel, Comment, sequelize } = require('../models');
const { Op } = require('sequelize');
const { AppError, asyncHandler } = require('../middleware/errorHandler');

// Get all cards with filtering, sorting, and pagination
exports.getAllCards = asyncHandler(async (req, res) => {
  const {
    // Pagination
    limit = 50,
    offset = 0,
    
    // Filters
    listId,
    priority,
    due, // 'overdue', 'today', 'this_week', 'no_due_date'
    assignedUser,
    boardId,
    
    // Sorting
    sortBy = 'position', // position, dueDate, priority, createdAt
    sortOrder = 'ASC' // ASC or DESC
  } = req.query;
  
  // Build where clause
  const where = {};
  const listWhere = {};
  const boardWhere = {};
  
  if (listId) where.listId = parseInt(listId);
  if (boardId) boardWhere.id = parseInt(boardId);
  if (priority) where.priority = priority;
  if (assignedUser) where.assignedUserId = parseInt(assignedUser);
  
  // Due date filtering
  if (due) {
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const todayEnd = new Date(now.setHours(23, 59, 59, 999));
    const weekEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    switch (due) {
      case 'overdue':
        where.dueDate = { [Op.lt]: new Date() };
        where.isCompleted = false;
        break;
      case 'today':
        where.dueDate = {
          [Op.gte]: todayStart,
          [Op.lte]: todayEnd
        };
        break;
      case 'this_week':
        where.dueDate = {
          [Op.gte]: todayStart,
          [Op.lte]: weekEnd
        };
        break;
      case 'no_due_date':
        where.dueDate = { [Op.eq]: null };
        break;
    }
  }
  
  // Build include array
  const include = [
    {
      model: List,
      as: 'list',
      where: Object.keys(listWhere).length ? listWhere : undefined,
      include: [{
        model: Board,
        as: 'Board',
        where: Object.keys(boardWhere).length ? boardWhere : undefined,
        attributes: ['id', 'title']
      }]
    },
    {
      model: User,
      as: 'assignedUser',
      attributes: ['id', 'name', 'email']
    },
    {
      model: Label,
      as: 'labels',
      through: { attributes: [] }
    }
  ];
  
  // Sorting mapping
  const validSortFields = {
    position: 'position',
    dueDate: 'dueDate',
    priority: 'priority',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };
  
  const orderField = validSortFields[sortBy] || 'position';
  const order = [[orderField, sortOrder.toUpperCase()]];
  
  // Execute query with pagination
  const cards = await Card.findAndCountAll({
    where,
    include,
    order,
    limit: Math.min(parseInt(limit), 100), // Cap at 100
    offset: parseInt(offset),
    distinct: true // Important for includes
  });
  
  // Add computed fields
  const cardsWithMeta = cards.rows.map(card => {
    const cardJson = card.toJSON();
    cardJson.isOverdue = card.isOverdue();
    cardJson.isDueToday = card.isDueToday();
    return cardJson;
  });
  
  res.status(200).json({
    cards: cardsWithMeta,
    total: cards.count,
    limit: parseInt(limit),
    offset: parseInt(offset),
    hasMore: parseInt(offset) + cards.rows.length < cards.count
  });
});

// Get single card by ID
exports.getCardById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const card = await Card.findByPk(id, {
    include: [
      { model: List, as: 'list', include: [{ model: Board, as: 'Board' }] },
      { model: User, as: 'assignedUser', attributes: ['id', 'name', 'email'] },
      { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
      { model: Label, as: 'labels', through: { attributes: [] } },
      { model: Comment, as: 'comments', include: [{ model: User, as: 'author', attributes: ['id', 'name'] }] }
    ]
  });
  
  if (!card) {
    throw new AppError('Card not found', 404);
  }
  
  const cardJson = card.toJSON();
  cardJson.isOverdue = card.isOverdue();
  cardJson.isDueToday = card.isDueToday();
  
  res.status(200).json(cardJson);
});

// Create new card
exports.createCard = asyncHandler(async (req, res) => {
  const { title, description, listId, priority, dueDate, assignedUserId } = req.body;
  const userId = req.user.id;
  
  // Validate list exists
  const list = await List.findByPk(listId);
  if (!list) {
    throw new AppError('List not found', 404);
  }
  
  // Get next position
  const position = await Card.getNextPosition(listId);
  
  const card = await Card.create({
    title,
    description,
    listId,
    priority: priority || 'medium',
    dueDate,
    assignedUserId,
    userId,
    position
  });
  
  // Fetch with associations
  const cardWithAssociations = await Card.findByPk(card.id, {
    include: [
      { model: List, as: 'list' },
      { model: User, as: 'assignedUser', attributes: ['id', 'name', 'email'] },
      { model: Label, as: 'labels', through: { attributes: [] } }
    ]
  });
  
  res.status(201).json(cardWithAssociations);
});

// Update card (partial update)
exports.updateCard = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.validatedBody || req.body;
  const userId = req.user.id;
  
  const card = await Card.findByPk(id, {
    include: [{ model: List, as: 'list', include: [{ model: Board, as: 'Board' }] }]
  });
  
  if (!card) {
    throw new AppError('Card not found', 404);
  }
  
  // Check if list and board are loaded
  if (!card.list || !card.list.Board) {
    throw new AppError('Card data integrity issue - list or board not found', 500);
  }
  
  // Authorization check for sensitive fields
  const sensitiveFields = ['priority', 'dueDate'];
  const hasSensitiveFields = Object.keys(updates).some(f => sensitiveFields.includes(f));
  
  if (hasSensitiveFields) {
    const isBoardOwner = card.list.Board.userId === userId;
    const isAssignedUser = card.assignedUserId === userId;
    
    if (!isBoardOwner && !isAssignedUser) {
      throw new AppError('Not authorized to update priority or due date', 403);
    }
  }
  
  await card.update(updates);
  
  // Fetch updated card with associations
  const updatedCard = await Card.findByPk(id, {
    include: [
      { model: List, as: 'list' },
      { model: User, as: 'assignedUser', attributes: ['id', 'name', 'email'] },
      { model: Label, as: 'labels', through: { attributes: [] } }
    ]
  });
  
  res.status(200).json(updatedCard);
});

// Delete card
exports.deleteCard = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const card = await Card.findByPk(id);
  
  if (!card) {
    throw new AppError('Card not found', 404);
  }
  
  await card.destroy();
  
  res.status(204).send();
});

// Move card to new list/position
exports.moveCard = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { newListId, newPosition } = req.body;
  
  const card = await Card.findByPk(id);
  
  if (!card) {
    throw new AppError('Card not found', 404);
  }
  
  // Validate new list exists
  const newList = await List.findByPk(newListId);
  if (!newList) {
    throw new AppError('Target list does not exist', 400);
  }
  
  const oldListId = card.listId;
  const oldPosition = card.position;
  
  // Transaction for atomic move
  const transaction = await sequelize.transaction();
  
  try {
    // Same list move
    if (oldListId === newListId) {
      if (newPosition > oldPosition) {
        // Moving down: decrement positions in between
        await Card.update(
          { position: sequelize.literal('position - 1') },
          {
            where: {
              listId: newListId,
              position: { [Op.gt]: oldPosition, [Op.lte]: newPosition },
              id: { [Op.ne]: id }
            },
            transaction
          }
        );
      } else if (newPosition < oldPosition) {
        // Moving up: increment positions in between
        await Card.update(
          { position: sequelize.literal('position + 1') },
          {
            where: {
              listId: newListId,
              position: { [Op.gte]: newPosition, [Op.lt]: oldPosition },
              id: { [Op.ne]: id }
            },
            transaction
          }
        );
      }
    } else {
      // Moving to different list
      
      // 1. Close gap in old list
      await Card.update(
        { position: sequelize.literal('position - 1') },
        {
          where: {
            listId: oldListId,
            position: { [Op.gt]: card.position }
          },
          transaction
        }
      );
      
      // 2. Make room in new list
      await Card.update(
        { position: sequelize.literal('position + 1') },
        {
          where: {
            listId: newListId,
            position: { [Op.gte]: newPosition }
          },
          transaction
        }
      );
    }
    
    // Update card
    await card.update({ listId: newListId, position: newPosition }, { transaction });
    
    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
  
  // Fetch updated card with associations
  const updatedCard = await Card.findByPk(id, {
    include: [
      { model: List, as: 'list' },
      { model: User, as: 'assignedUser', attributes: ['id', 'name', 'email'] },
      { model: Label, as: 'labels', through: { attributes: [] } }
    ]
  });
  
  res.status(200).json(updatedCard);
});

// Add label to card
exports.addLabel = asyncHandler(async (req, res) => {
  const { cardId } = req.params;
  const { labelId } = req.body;
  
  const card = await Card.findByPk(cardId, {
    include: [{ model: List, as: 'list', include: [{ model: Board, as: 'Board' }] }]
  });
  
  if (!card) {
    throw new AppError('Card not found', 404);
  }
  
  // Verify label belongs to same board
  const label = await Label.findByPk(labelId);
  if (!label) {
    throw new AppError('Label not found', 404);
  }
  
  if (label.boardId !== card.list.Board.id) {
    throw new AppError('Label must belong to the same board as the card', 400);
  }
  
  // Check for duplicate
  const existing = await CardLabel.findOne({
    where: { cardId: parseInt(cardId), labelId: parseInt(labelId) }
  });
  
  if (existing) {
    throw new AppError('Label already assigned to this card', 400);
  }
  
  await CardLabel.create({ cardId: parseInt(cardId), labelId: parseInt(labelId) });
  
  const cardWithLabels = await Card.findByPk(cardId, {
    include: [
      { model: Label, as: 'labels', through: { attributes: [] } }
    ]
  });
  
  res.status(201).json(cardWithLabels);
});

// Remove label from card
exports.removeLabel = asyncHandler(async (req, res) => {
  const { cardId, labelId } = req.params;
  
  const result = await CardLabel.destroy({
    where: { cardId: parseInt(cardId), labelId: parseInt(labelId) }
  });
  
  if (result === 0) {
    throw new AppError('Label not found on card', 404);
  }
  
  res.status(204).send();
});

// Get comments for a card
exports.getComments = asyncHandler(async (req, res) => {
  const { cardId } = req.params;
  const { limit = 50, offset = 0 } = req.query;
  
  const comments = await Comment.findAndCountAll({
    where: { cardId },
    include: [{ model: User, as: 'author', attributes: ['id', 'name', 'email'] }],
    order: [['createdAt', 'ASC']], // Oldest first
    limit: parseInt(limit),
    offset: parseInt(offset)
  });
  
  res.status(200).json({
    comments: comments.rows,
    total: comments.count,
    limit: parseInt(limit),
    offset: parseInt(offset)
  });
});

// Create comment
exports.createComment = asyncHandler(async (req, res) => {
  const { cardId } = req.params;
  const { content } = req.body;
  const userId = req.user.id;
  
  // Verify card exists
  const card = await Card.findByPk(cardId, {
    include: [{ model: List, as: 'list', include: [{ model: Board, as: 'Board' }] }]
  });
  
  if (!card) {
    throw new AppError('Card not found', 404);
  }
  
  const comment = await Comment.create({
    content,
    userId,
    cardId: parseInt(cardId)
  });
  
  // Fetch with author
  const commentWithAuthor = await Comment.findByPk(comment.id, {
    include: [{ model: User, as: 'author', attributes: ['id', 'name', 'email'] }]
  });
  
  res.status(201).json(commentWithAuthor);
});

// Reorder cards (bulk update)
exports.reorderCards = asyncHandler(async (req, res) => {
  const { cards } = req.body;
  
  const updates = cards.map(({ id, listId, position }) =>
    Card.update(
      { listId, position },
      { where: { id } }
    )
  );
  
  await Promise.all(updates);
  res.status(200).json({ message: 'Cards reordered successfully' });
});
