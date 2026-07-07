const { List, Card, Board } = require('../models');
const { ok, created, notFound, forbidden, serverError } = require('../middleware/responseFormatter');

exports.createList = async (req, res) => {
  try {
    const { title, boardId } = req.body;

    const board = await Board.findByPk(boardId);
    if (!board) return notFound(res, 'Board not found', 'No board found with this ID');
    if (board.userId !== req.user.id) {
      return forbidden(res, 'Not authorized', 'You are not a member of this board');
    }

    const maxPosition = await List.max('position', {where: { boardId }});
    const position = Number.isFinite(maxPosition) ? maxPosition + 1 : 0;
    const list = await List.create({ title, boardId, position });
    return created(res, list, 'List created successfully');
  } catch (err) {
    console.error('Error creating list:', err);
    return serverError(res, 'Failed to create list');
  }
};

exports.getAllLists = async (req, res) => {
    try {
        const lists = await List.findAll({
          include: [{ model: Board, as: 'Board', where: { userId: req.user.id }, attributes: [] }]
        });
        return ok(res, lists);
    } catch (err) {
        console.error('Error fetching lists', err);
        return serverError(res, 'Failed to fetch lists');
    }
};

// req.list is populated by the authorizeListMember middleware
exports.getListById = async (req, res) => {
  return ok(res, req.list);
};

exports.updateList = async (req, res) => {
  const { title } = req.body;

  try {
    const list = req.list;
    list.title = title;
    await list.save();
    return ok(res, list, 'List updated successfully');
  } catch (err) {
    console.error('Error updating list:', err);
    return serverError(res, 'Failed to update list');
  }
};

exports.deleteList = async (req, res) => {
  try {
    await req.list.destroy();
    return res.status(204).send();
  } catch (err) {
    console.error('Error deleting list:', err);
    return serverError(res, 'Failed to delete list');
  }
};

exports.reorderLists = async (req, res) => {
  try {
    const { boardId, lists } = req.body;

    const board = await Board.findByPk(boardId);
    if (!board || board.userId !== req.user.id) {
      return forbidden(res, 'Not authorized', 'You are not a member of this board');
    }

    const listIds = lists.map(({ id }) => id);
    const ownedCount = await List.count({ where: { id: listIds, boardId } });
    if (ownedCount !== listIds.length) {
      return forbidden(res, 'Not authorized', 'All lists must belong to the specified board');
    }

    const updates = lists.map(({ id, position }) =>
      List.update({ position }, { where: { id, boardId }}));
    await Promise.all(updates);
    return ok(res, null, 'Lists reordered successfully');
  } catch (err) {
    console.error('Error reordering lists', err);
    return serverError(res, 'Failed to reorder lists');
  }
};
