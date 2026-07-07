const express = require('express');
const router = express.Router();
const listController = require('../controllers/listController');
const authenticateToken = require('../middleware/authMiddleware');
const { authorizeListMember } = require('../middleware/authorization');
const { validateList, validateListUpdate, validateListReorder } = require('../middleware/validation');

router.post('/', authenticateToken, validateList, listController.createList);
router.get('/', authenticateToken, listController.getAllLists);
router.get('/:id', authenticateToken, authorizeListMember, listController.getListById);
router.put('/reorder', authenticateToken, validateListReorder, listController.reorderLists);
router.put('/:id', authenticateToken, authorizeListMember, validateListUpdate, listController.updateList);
router.delete('/:id', authenticateToken, authorizeListMember, listController.deleteList);

module.exports = router;
