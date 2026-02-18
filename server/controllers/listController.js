const { List, Card } = require('../models');
const { ok, created, notFound, serverError } = require('../middleware/responseFormatter');

exports.createList = async (req, res) => {
  try {
    const { title, boardId } = req.body;
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
        const lists = await List.findAll();
        return ok(res, lists);
    } catch (err) {
        console.error('Error fetching lists', err);
        return serverError(res, 'Failed to fetch lists');
    } 
};

exports.getListById = async (req, res) => {
  const { id } = req.params;

  try {
    const list = await List.findByPk(id);
    if (!list) return notFound(res, 'List not found', 'No list found with this ID');
    return ok(res, list);
  } catch (err) {
    console.error('Error fetching list:', err);
    return serverError(res, 'Failed to fetch list');
  }
};

exports.updateList = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  try {
    const list = await List.findOne({
      where: { id },
    });
    if (!list) return notFound(res, 'List not found', 'No list found with this ID');
    list.title = title;
    await list.save();
    return ok(res, list, 'List updated successfully');
  } catch (err) {
    console.error('Error updating list:', err);
    return serverError(res, 'Failed to update list');
  }
};

exports.deleteList = async (req, res) => {
  const { id } = req.params;

  try {
    const list = await List.findOne({
      where: { id },
    });
    if (!list) return notFound(res, 'List not found', 'No list found with this ID');

    await list.destroy();
    return res.status(204).send();
  } catch (err) {
    console.error('Error deleting list:', err);
    return serverError(res, 'Failed to delete list');
  }
};

exports.reorderLists = async (req, res) => {
  try {
    const { boardId, lists} = req.body;

    const updates = lists.map(({ id, position }) =>
      List.update({ position }, { where: { id }}));
    await Promise.all(updates);
    return ok(res, null, 'Lists reordered successfully');
  } catch (err) {
    console.error('Error reordering lists', err);
    return serverError(res, 'Failed to reorder lists');
  }
};
