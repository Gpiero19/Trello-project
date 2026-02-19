const { Template, TemplateList, TemplateCard, Board, List, Card, User } = require('../models');
const { ok, created, notFound, badRequest, serverError } = require('../middleware/responseFormatter');
const { Op } = require('sequelize');

/**
 * GET /api/templates
 * Returns all public templates and user's private templates
 */
exports.getAllTemplates = async (req, res) => {
  try {
    // Handle both authenticated and unauthenticated requests
    const userId = req.user?.id;

    // Build where clause - return public templates AND user's private templates
    let whereClause;
    if (userId) {
      const userIdInt = parseInt(userId);
      
      templates = await Template.findAll({
        where: {
          [Op.or]: [
            { isPublic: true },
            { userId: userIdInt }
          ]
        },
        include: [
          {
            model: TemplateList,
            as: 'lists',
            include: [
              {
                model: TemplateCard,
                as: 'cards'
              }
            ]
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name']
          }
        ],
        order: [
          ['createdAt', 'DESC'],
          [{ model: TemplateList, as: 'lists' }, 'position', 'ASC'],
          [{ model: TemplateList, as: 'lists' }, { model: TemplateCard, as: 'cards' }, 'position', 'ASC']
        ]
      });
    } else {
      templates = await Template.findAll({
        where: { isPublic: true },
        include: [
          {
            model: TemplateList,
            as: 'lists',
            include: [
              {
                model: TemplateCard,
                as: 'cards'
              }
            ]
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name']
          }
        ],
        order: [
          ['createdAt', 'DESC'],
          [{ model: TemplateList, as: 'lists' }, 'position', 'ASC'],
          [{ model: TemplateList, as: 'lists' }, { model: TemplateCard, as: 'cards' }, 'position', 'ASC']
        ]
      });
    }

    return ok(res, templates);
  } catch (err) {
      console.error('Error fetching templates:', err);
      return serverError(res, 'Failed to fetch templates');
  }
};

/**
 * POST /api/templates
 * Creates a new custom template
 * Body: { name, description, lists: [{ title, cards: [{ title, description }] }] }
 */
exports.createTemplate = async (req, res) => {
  const transaction = await Template.sequelize.transaction();

  try {
    const userId = req.user?.id;
    const { name, description, isPublic, lists } = req.body;

    console.log('=== CREATE TEMPLATE DEBUG ===');
    console.log('userId from token:', userId);
    console.log('Received data:', { name, description, isPublic, listsCount: lists?.length });
    console.log('isPublic value:', isPublic, 'type:', typeof isPublic);
    console.log('===========================');

    if (!userId) {
      await transaction.rollback();
      return badRequest(res, 'User authentication required');
    }

    // Create the template
    const template = await Template.create({
      name,
      description: description || null,
      isPublic: isPublic !== undefined ? isPublic : true,
      userId
    }, { transaction });

    console.log('Created template with id:', template.id, 'isPublic:', template.isPublic, 'userId:', template.userId);

    // If lists are provided, create them with their cards
    if (lists && Array.isArray(lists) && lists.length > 0) {
      for (let listIndex = 0; listIndex < lists.length; listIndex++) {
        const listData = lists[listIndex];
        
        const templateList = await TemplateList.create({
          title: listData.title,
          position: listIndex,
          templateId: template.id
        }, { transaction });

        // Create cards for this list
        if (listData.cards && Array.isArray(listData.cards)) {
          for (let cardIndex = 0; cardIndex < listData.cards.length; cardIndex++) {
            const cardData = listData.cards[cardIndex];
            
            await TemplateCard.create({
              title: cardData.title,
              description: cardData.description || null,
              position: cardIndex,
              templateListId: templateList.id
            }, { transaction });
          }
        }
      }
    }

    await transaction.commit();

    // Fetch the complete template with all relations
    const completeTemplate = await Template.findByPk(template.id, {
      include: [
        {
          model: TemplateList,
          as: 'lists',
          include: [
            {
              model: TemplateCard,
              as: 'cards'
            }
          ]
        }
      ],
      order: [
        [{ model: TemplateList, as: 'lists' }, 'position', 'ASC'],
        [{ model: TemplateList, as: 'lists' }, { model: TemplateCard, as: 'cards' }, 'position', 'ASC']
      ]
    });

    return created(res, completeTemplate, 'Template created successfully');
  } catch (err) {
    await transaction.rollback();
    console.error('Error creating template:', err);
    return serverError(res, 'Failed to create template');
  }
};

/**
 * GET /api/templates/:id
 * Returns full template structure: Template → Lists → Cards
 */
exports.getTemplateById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Find template - must be public OR belong to the current user
    const template = await Template.findOne({
      where: {
        id,
        [Op.or]: [
          { isPublic: true },
          { userId: userId }
        ]
      },
      include: [
        {
          model: TemplateList,
          as: 'lists',
          include: [
            {
              model: TemplateCard,
              as: 'cards'
            }
          ]
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name']
        }
      ],
      order: [
        [{ model: TemplateList, as: 'lists' }, 'position', 'ASC'],
        [{ model: TemplateList, as: 'lists' }, { model: TemplateCard, as: 'cards' }, 'position', 'ASC']
      ]
    });

    if (!template) {
      return notFound(res, 'Template not found', 'No template found with this ID');
    }

    return ok(res, template);
  } catch (err) {
    console.error('Error fetching template:', err);
    return serverError(res, 'Failed to fetch template');
  }
};

/**
 * POST /api/templates/:id/use
 * Creates a new board from template
 * - Creates new Board
 * - Copies all lists from TemplateLists
 * - Copies all cards from TemplateCards
 * - Preserves positions
 * - Assigns board to logged-in user
 * - Returns created board
 */
exports.useTemplate = async (req, res) => {
  const transaction = await Template.sequelize.transaction();

  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      await transaction.rollback();
      return badRequest(res, 'User authentication required');
    }

    // Find template
    const template = await Template.findOne({
      where: {
        id,
        [Op.or]: [
          { isPublic: true },
          { userId: userId }
        ]
      },
      include: [
        {
          model: TemplateList,
          as: 'lists',
          include: [
            {
              model: TemplateCard,
              as: 'cards'
            }
          ]
        }
      ],
      order: [
        [{ model: TemplateList, as: 'lists' }, 'position', 'ASC'],
        [{ model: TemplateList, as: 'lists' }, { model: TemplateCard, as: 'cards' }, 'position', 'ASC']
      ]
    });

    if (!template) {
      await transaction.rollback();
      return notFound(res, 'Template not found', 'No template found with this ID');
    }

    // Get max position for user's boards
    const maxPosition = await Board.max('position', { where: { userId } });
    const boardPosition = Number.isFinite(maxPosition) ? maxPosition + 1 : 0;

    // Create the board
    const board = await Board.create({
      title: template.name,
      description: template.description,
      userId,
      position: boardPosition
    }, { transaction });

    // Copy all lists and cards from template
    if (template.lists && template.lists.length > 0) {
      for (const templateList of template.lists) {
        // Create the list
        const list = await List.create({
          title: templateList.title,
          position: templateList.position,
          boardId: board.id
        }, { transaction });

        // Copy all cards from this template list
        if (templateList.cards && templateList.cards.length > 0) {
          for (const templateCard of templateList.cards) {
            await Card.create({
              title: templateCard.title,
              description: templateCard.description,
              position: templateCard.position,
              listId: list.id,
              userId: userId,
              priority: 'medium',
              isCompleted: false
            }, { transaction });
          }
        }
      }
    }

    await transaction.commit();

    // Fetch the complete board with lists and cards
    const completeBoard = await Board.findByPk(board.id, {
      include: [
        {
          model: List,
          as: 'Lists',
          include: [
            {
              model: Card,
              as: 'Cards'
            }
          ]
        }
      ],
      order: [
        [{ model: List, as: 'Lists' }, 'position', 'ASC'],
        [{ model: List, as: 'Lists' }, { model: Card, as: 'Cards' }, 'position', 'ASC']
      ]
    });

    return created(res, completeBoard, 'Board created from template successfully');
  } catch (err) {
    await transaction.rollback();
    console.error('Error using template:', err);
    return serverError(res, 'Failed to create board from template');
  }
};

/**
 * PUT /api/templates/:id
 * Updates a template
 */
exports.updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const { name, description, isPublic } = req.body;

    // Find template - must belong to the current user
    const template = await Template.findOne({
      where: {
        id,
        userId: userId
      }
    });

    if (!template) {
      return notFound(res, 'Template not found', 'No template found with this ID or you do not have permission');
    }

    // Update fields
    if (name !== undefined) template.name = name;
    if (description !== undefined) template.description = description;
    if (isPublic !== undefined) template.isPublic = isPublic;

    await template.save();

    return ok(res, template, 'Template updated successfully');
  } catch (err) {
    console.error('Error updating template:', err);
    return serverError(res, 'Failed to update template');
  }
};

/**
 * DELETE /api/templates/:id
 * Deletes a template (only if user owns it)
 */
exports.deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Find template - must belong to the current user
    const template = await Template.findOne({
      where: {
        id,
        userId: userId
      }
    });

    if (!template) {
      return notFound(res, 'Template not found', 'No template found with this ID or you do not have permission');
    }

    await template.destroy();

    return ok(res, null, 'Template deleted successfully');
  } catch (err) {
    console.error('Error deleting template:', err);
    return serverError(res, 'Failed to delete template');
  }
};
