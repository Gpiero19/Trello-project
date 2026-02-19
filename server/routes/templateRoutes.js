const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');
const { authenticateToken, optionalAuth } = require('../middleware/authMiddleware');
const { validateTemplate, validateTemplateUpdate } = require('../middleware/validation');

// Public routes (authentication optional)
// GET /api/templates - Returns all public templates and user's private templates
router.get('/', optionalAuth, templateController.getAllTemplates);

// Protected routes (authentication required)
// POST /api/templates - Creates a new custom template
router.post('/', authenticateToken, validateTemplate, templateController.createTemplate);

// GET /api/templates/:id - Returns full template structure
router.get('/:id', authenticateToken, templateController.getTemplateById);

// POST /api/templates/:id/use - Creates a new board from template
router.post('/:id/use', authenticateToken, templateController.useTemplate);

// PUT /api/templates/:id - Updates a template
router.put('/:id', authenticateToken, validateTemplateUpdate, templateController.updateTemplate);

// DELETE /api/templates/:id - Deletes a template
router.delete('/:id', authenticateToken, templateController.deleteTemplate);

module.exports = router;
