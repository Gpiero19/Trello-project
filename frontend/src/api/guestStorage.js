// Guest storage utility for localStorage-based board management

const GUEST_BOARDS_KEY = 'frello_guest_boards';
const GUEST_BOARD_PREFIX = 'frello_guest_board_';

// Generate a unique ID for guest boards
export const generateGuestId = () => {
  return `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get all guest boards (metadata)
export const getGuestBoards = () => {
  try {
    const data = localStorage.getItem(GUEST_BOARDS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Error reading guest boards:', err);
    return [];
  }
};

// Save guest boards metadata
export const saveGuestBoards = (boards) => {
  try {
    localStorage.setItem(GUEST_BOARDS_KEY, JSON.stringify(boards));
  } catch (err) {
    console.error('Error saving guest boards:', err);
  }
};

// Get a single guest board with all lists and cards
export const getGuestBoard = (boardId) => {
  try {
    const data = localStorage.getItem(`${GUEST_BOARD_PREFIX}${boardId}`);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error('Error reading guest board:', err);
    return null;
  }
};

// Save a guest board with all its data
export const saveGuestBoard = (board) => {
  try {
    localStorage.setItem(`${GUEST_BOARD_PREFIX}${board.id}`, JSON.stringify(board));
    
    // Update boards list
    const boards = getGuestBoards();
    const existingIndex = boards.findIndex(b => b.id === board.id);
    
    const boardMeta = {
      id: board.id,
      title: board.title,
      description: board.description,
      isGuest: true
    };
    
    if (existingIndex >= 0) {
      boards[existingIndex] = boardMeta;
    } else {
      boards.push(boardMeta);
    }
    
    saveGuestBoards(boards);
    return true;
  } catch (err) {
    console.error('Error saving guest board:', err);
    return false;
  }
};

// Delete a guest board
export const deleteGuestBoard = (boardId) => {
  try {
    localStorage.removeItem(`${GUEST_BOARD_PREFIX}${boardId}`);
    
    const boards = getGuestBoards();
    const filtered = boards.filter(b => b.id !== boardId);
    saveGuestBoards(filtered);
    return true;
  } catch (err) {
    console.error('Error deleting guest board:', err);
    return false;
  }
};

// Update guest board title
export const updateGuestBoardTitle = (boardId, newTitle) => {
  try {
    const board = getGuestBoard(boardId);
    if (board) {
      board.title = newTitle;
      saveGuestBoard(board);
      
      const boards = getGuestBoards();
      const boardMeta = boards.find(b => b.id === boardId);
      if (boardMeta) {
        boardMeta.title = newTitle;
        saveGuestBoards(boards);
      }
    }
    return true;
  } catch (err) {
    console.error('Error updating guest board title:', err);
    return false;
  }
};

// Check if a board ID is a guest board
export const isGuestBoard = (boardId) => {
  return boardId && boardId.toString().startsWith('guest_');
};

// Clear all guest data (when user logs in or registers)
export const clearGuestData = () => {
  try {
    const boards = getGuestBoards();
    boards.forEach(board => {
      localStorage.removeItem(`${GUEST_BOARD_PREFIX}${board.id}`);
    });
    localStorage.removeItem(GUEST_BOARDS_KEY);
    return true;
  } catch (err) {
    console.error('Error clearing guest data:', err);
    return false;
  }
};

// Get all guest boards with full data (for migration)
export const getAllGuestBoardsWithData = () => {
  try {
    const boards = getGuestBoards();
    return boards.map(boardMeta => {
      const fullBoard = getGuestBoard(boardMeta.id);
      return fullBoard || boardMeta;
    }).filter(Boolean);
  } catch (err) {
    console.error('Error getting guest boards for migration:', err);
    return [];
  }
};

// Check if there are guest boards
export const hasGuestBoards = () => {
  const boards = getGuestBoards();
  return boards.length > 0;
};

// Guest List functions
export const saveGuestList = (boardId, list) => {
  const board = getGuestBoard(boardId);
  if (!board) return false;
  
  if (!board.Lists) board.Lists = [];
  board.Lists.push(list);
  return saveGuestBoard(board);
};

export const deleteGuestList = (boardId, listId) => {
  const board = getGuestBoard(boardId);
  if (!board || !board.Lists) return false;
  
  board.Lists = board.Lists.filter(l => l.id !== listId);
  return saveGuestBoard(board);
};

export const updateGuestList = (boardId, listId, updates) => {
  const board = getGuestBoard(boardId);
  if (!board || !board.Lists) return false;
  
  const listIndex = board.Lists.findIndex(l => l.id === listId);
  if (listIndex >= 0) {
    board.Lists[listIndex] = { ...board.Lists[listIndex], ...updates };
    return saveGuestBoard(board);
  }
  return false;
};

// Guest Card functions
export const saveGuestCard = (boardId, listId, card) => {
  const board = getGuestBoard(boardId);
  if (!board || !board.Lists) return false;
  
  const list = board.Lists.find(l => l.id === listId);
  if (!list) return false;
  
  if (!list.Cards) list.Cards = [];
  list.Cards.push(card);
  return saveGuestBoard(board);
};

export const deleteGuestCard = (boardId, listId, cardId) => {
  const board = getGuestBoard(boardId);
  if (!board || !board.Lists) return false;
  
  const list = board.Lists.find(l => l.id === listId);
  if (!list || !list.Cards) return false;
  
  list.Cards = list.Cards.filter(c => c.id !== cardId);
  return saveGuestBoard(board);
};

export const updateGuestCard = (boardId, listId, cardId, updates) => {
  const board = getGuestBoard(boardId);
  if (!board || !board.Lists) return false;
  
  const list = board.Lists.find(l => l.id === listId);
  if (!list || !list.Cards) return false;
  
  const cardIndex = list.Cards.findIndex(c => c.id === cardId);
  if (cardIndex >= 0) {
    list.Cards[cardIndex] = { ...list.Cards[cardIndex], ...updates };
    return saveGuestBoard(board);
  }
  return false;
};
