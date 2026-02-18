const { Board, List, Card } = require('../models');
const { notFound, forbidden, serverError } = require('./responseFormatter');

// Check if user is board member (owner)
const checkBoardMembership = async (userId, boardId) => {
  const board = await Board.findByPk(boardId);
  if (!board) return false;
  return board.userId === userId;
};

// Middleware: authorize board member
const authorizeBoardMember = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Determine board ID based on route
    let boardId;
    
    if (req.params.boardId) {
      boardId = parseInt(req.params.boardId);
    } else if (req.params.cardId) {
      const card = await Card.findByPk(req.params.cardId, {
        include: [{ model: List, as: 'list' }]
      });
      if (!card) {
        return notFound(res, 'Card not found', 'Card does not exist');
      }
      boardId = card.list.boardId;
    } else if (req.params.listId) {
      const list = await List.findByPk(req.params.listId, {
        include: [{ model: Board, as: 'Board' }]
      });
      if (!list) {
        return notFound(res, 'List not found', 'List does not exist');
      }
      boardId = list.boardId;
    }
    
    const isMember = await checkBoardMembership(userId, boardId);
    if (!isMember) {
      return forbidden(res, 'Not authorized', 'You are not a member of this board');
    }
    
    req.boardId = boardId;
    next();
  } catch (err) {
    console.error('Authorization error:', err);
    return serverError(res, 'Authorization failed');
  }
};

// Middleware: authorize card edit (more restrictive)
const authorizeCardEdit = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id: cardId } = req.params;
    
    const card = await Card.findByPk(cardId, {
      include: [
        { model: List, as: 'list' }
      ]
    });
    
    if (!card) {
      return notFound(res, 'Card not found', 'Card does not exist');
    }
    
    // Check if list exists
    if (!card.list) {
      console.error('Card list not found:', { cardId, listId: card.listId });
      return serverError(res, 'Data integrity error', 'Card has no associated list');
    }
    
    // Get board directly from list's boardId
    const board = await Board.findByPk(card.list.boardId);
    if (!board) {
      return notFound(res, 'Board not found', 'Board does not exist');
    }
    
    const isBoardOwner = board.userId === userId;
    const isAssignedUser = card.assignedUserId === userId;
    const isCardCreator = card.userId === userId;
    
    // Full edit: board owner, assigned user, or creator
    if (isBoardOwner || isAssignedUser || isCardCreator) {
      req.card = card;
      req.isBoardOwner = isBoardOwner;
      return next();
    }
    
    // Check board membership for basic operations
    const isMember = board.userId === userId;
    if (!isMember) {
      return forbidden(res, 'Not authorized', 'You cannot edit this card');
    }
    
    req.card = card;
    req.isBoardOwner = isBoardOwner;
    next();
  } catch (err) {
    console.error('Authorization error:', err);
    return serverError(res, 'Authorization failed');
  }
};

// Middleware: authorize sensitive fields (priority, dueDate changes)
const authorizeSensitiveFields = async (req, res, next) => {
  const { priority, dueDate } = req.body;
  const hasSensitiveFields = priority !== undefined || dueDate !== undefined;
  
  if (!hasSensitiveFields) {
    return next();
  }
  
  // If card is already loaded by previous middleware, use it; otherwise fetch
  let card = req.card;
  if (!card) {
    card = await Card.findByPk(req.params.id, {
      include: [{ model: List, as: 'list' }]
    });
  }
  
  if (!card || !card.list) {
    return serverError(res, 'Data integrity error', 'Card has no associated list');
  }
  
  // Get board directly
  const board = await Board.findByPk(card.list.boardId);
  if (!board) {
    return notFound(res, 'Board not found', 'Board does not exist');
  }
  
  const userId = req.user.id;
  const isBoardOwner = board.userId === userId;
  const isAssignedUser = card.assignedUserId === userId;
  
  if (!isBoardOwner && !isAssignedUser) {
    return forbidden(res, 'Not authorized', 'Only board owner or assigned user can update priority or due date');
  }
  
  next();
};

module.exports = {
  checkBoardMembership,
  authorizeBoardMember,
  authorizeCardEdit,
  authorizeSensitiveFields
};
