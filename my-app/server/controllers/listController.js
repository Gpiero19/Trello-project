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
<<<<<<< HEAD
  const { boardId } = req.params;
  const userId = req.user?.id || null;
  const guestId = req.query.guestId || null;

  try {
    const lists = await List.findAll({
      where: { boardId, ...(userId ? { userId } : { guestId }) },
      order: [['position', 'ASC']],
    });
    res.status(200).json(lists);
  } catch (err) {
    console.error('Error fetching lists', err);
    res.status(500).json({ error: 'Internal server error' });
  }
=======
    try {
        const lists = await List.findAll(); //fetch list from DB
        res.status(200).json(lists)
    } catch (err) {
        console.error('Error fetching lists', err)
        res.status(500).json({error: 'Internal server error'})
    } 
>>>>>>> parent of a8dbd4b (Reorder - drag n drop fixed)
};

exports.getListById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id || null;
  const guestId = req.query.guestId || null;

  try {
<<<<<<< HEAD
    const list = await List.findOne({
      where: { id, ...(userId ? { userId } : { guestId }) },
      include: [
        {
          model: Card,
          as: 'cards',
          separate: true,
          order: [['position', 'ASC']],
        },
      ],
    });

    if (!list) return res.status(404).json({ error: 'List not found' });
    res.status(200).json(list);
=======
    const list = await List.findByPk(id);
    if (!list) return res.status(404).json({ error: 'List not found'});
    res.status(200).json(list)
>>>>>>> parent of a8dbd4b (Reorder - drag n drop fixed)
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
<<<<<<< HEAD
    const { lists } = req.body;
    const userId = req.user?.id || null;
    const guestId = req.body.guestId || null;

    const updates = lists.map(({ id, boardId, position }) =>
      List.update(
        { boardId, position },
        { where: { id, ...(userId ? { userId } : { guestId }) } }
      )
    );

    await Promise.all(updates);
    res.status(200).json({ message: 'Lists reordered successfully' });
=======
    const { boardId, lists} = req.body;

    const updates = lists.map(({ id, position }) =>
      List.update({ position }, { where: { id, boardId }})
    );
    await Promise.all(updates)
>>>>>>> parent of a8dbd4b (Reorder - drag n drop fixed)
  } catch (err) {
    console.error('Error reordering lists', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
