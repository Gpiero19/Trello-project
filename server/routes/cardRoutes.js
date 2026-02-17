const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');
const commentController = require('../controllers/commentController');
const { validateCard, validateCardUpdate, validateCardMove, validateComment } = require('../middleware/validation');
const { authorizeCardEdit, authorizeBoardMember, authorizeSensitiveFields } = require('../middleware/authorization');
const authenticateToken = require('../middleware/authMiddleware');

// GET /cards - List all cards with filters
router.get('/', authenticateToken, cardController.getAllCards);

// POST /cards - Create new card
router.post('/', authenticateToken, validateCard, cardController.createCard);

// DELETE /cards/comments/:id - Delete comment
router.delete('/comments/:id', authenticateToken, commentController.deleteComment);

// Nested routes for comments - MUST come after /comments/:id
// GET /cards/:cardId/comments - Get comments for card
router.get('/:cardId/comments', authenticateToken, cardController.getComments);

// POST /cards/:cardId/comments - Create comment
router.post('/:cardId/comments', authenticateToken, validateComment, cardController.createComment);

// GET /cards/:id - Get single card
router.get('/:id', authenticateToken, cardController.getCardById);

// PATCH /cards/:id - Partial update
router.patch('/:id', authenticateToken, authorizeCardEdit, validateCardUpdate, cardController.updateCard);

// DELETE /cards/:id - Delete card
router.delete('/:id', authenticateToken, authorizeCardEdit, cardController.deleteCard);

// PATCH /cards/:id/move - Move card to new list/position
router.patch('/:id/move', authenticateToken, authorizeCardEdit, validateCardMove, cardController.moveCard);

// POST /cards/reorder - Bulk reorder
router.post('/reorder', authenticateToken, cardController.reorderCards);

// PUT /cards/reorder - Bulk reorder (alternative)
router.put('/reorder', authenticateToken, cardController.reorderCards);

// Nested routes for labels
// POST /cards/:cardId/labels - Add label to card
router.post('/:cardId/labels', authenticateToken, authorizeBoardMember, cardController.addLabel);

// DELETE /cards/:cardId/labels/:labelId - Remove label from card
router.delete('/:cardId/labels/:labelId', authenticateToken, authorizeBoardMember, cardController.removeLabel);

module.exports = router;
