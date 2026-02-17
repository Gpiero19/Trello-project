const { Board, List, Card } = require('../models');

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
        include: [{ model: List }]
      });
      if (!card) {
        return res.status(404).json({ error: 'Card not found' });
      }
      boardId = card.list.boardId;
    } else if (req.params.listId) {
      const list = await List.findByPk(req.params.listId, {
        include: [{ model: Board }]
      });
      if (!list) {
        return res.status(404).json({ error: 'List not found' });
      }
      boardId = list.boardId;
    }
    
    const isMember = await checkBoardMembership(userId, boardId);
    if (!isMember) {
      return res.status(403).json({ error: 'Not a member of this board' });
    }
    
    req.boardId = boardId;
    next();
  } catch (err) {
    console.error('Authorization error:', err);
    res.status(500).json({ error: 'Authorization failed' });
  }
};

// Middleware: authorize card edit (more restrictive)
const authorizeCardEdit = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id: cardId } = req.params;
    
    const card = await Card.findByPk(cardId, {
      include: [
        { model: List, include: [{ model: Board }] }
      ]
    });
    
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }
    
    const board = card.list.board;
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
      return res.status(403).json({ error: 'Not authorized to edit this card' });
    }
    
    req.card = card;
    req.isBoardOwner = isBoardOwner;
    next();
  } catch (err) {
    console.error('Authorization error:', err);
    res.status(500).json({ error: 'Authorization failed' });
  }
};

// Middleware: authorize sensitive fields (priority, dueDate changes)
const authorizeSensitiveFields = async (req, res, next) => {
  const { priority, dueDate } = req.body;
  const hasSensitiveFields = priority !== undefined || dueDate !== undefined;
  
  if (!hasSensitiveFields) {
    return next();
  }
  
  const card = req.card || await Card.findByPk(req.params.id, {
    include: [{ model: List, include: [{ model: Board }] }]
  });
  
  const userId = req.user.id;
  const isBoardOwner = card.list.board.userId === userId;
  const isAssignedUser = card.assignedUserId === userId;
  
  if (!isBoardOwner && !isAssignedUser) {
    return res.status(403).json({ 
      error: 'Only board owner or assigned user can update priority or due date' 
    });
  }
  
  next();
};

module.exports = {
  checkBoardMembership,
  authorizeBoardMember,
  authorizeCardEdit,
  authorizeSensitiveFields
};
