const { List, Card } = require('../models');

exports.createList = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const { title, boardId, guestId } = req.body;

    const maxPosition = await List.max('position', {
      where: { boardId, ...(userId ? { userId } : { guestId }) }
    });
    const position = Number.isFinite(maxPosition) ? maxPosition + 1 : 0;

    const list = await List.create({ title, boardId, position, userId, guestId });

    res.status(201).json(list);
  } catch (err) {
    console.error('Error creating list:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllLists = async (req, res) => {
    try {
        const lists = await List.findAll(); //fetch list from DB
        res.status(200).json(lists)
    } catch (err) {
        console.error('Error fetching lists', err)
        res.status(500).json({error: 'Internal server error'})
    } 
};

exports.getListById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id || null;
  const guestId = req.query.guestId || null;

  try {
    const list = await List.findByPk(id);
    if (!list) return res.status(404).json({ error: 'List not found'});
    res.status(200).json(list)
  } catch (err) {
    console.error('Error fetching list:', err);
    res.status(500).json({ error: 'List not found' });
  }
};

exports.updateList = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const userId = req.user?.id || null;
  const guestId = req.body.guestId || null;

  try {
    const list = await List.findOne({
      where: { id, ...(userId ? { userId } : { guestId }) },
    });
    if (!list) return res.status(404).json({ error: 'List not found' });

    list.title = title;
    await list.save();

    res.status(200).json(list);
  } catch (err) {
    console.error('Error updating list:', err);
    res.status(500).json({ error: 'Error updating list' });
  }
};

exports.deleteList = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id || null;
  const guestId = req.query.guestId || null;

  try {
    const list = await List.findOne({
      where: { id, ...(userId ? { userId } : { guestId }) },
    });
    if (!list) return res.status(404).json({ error: 'List not found' });

    await list.destroy();
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting list:', err);
    res.status(500).json({ error: 'Error deleting list' });
  }
};

exports.reorderLists = async (req, res) => {
  try {
    const { boardId, lists} = req.body;

    const updates = lists.map(({ id, position }) =>
      List.update({ position }, { where: { id, boardId }})
    );
    await Promise.all(updates)
  } catch (err) {
    console.error('Error reordering lists', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
