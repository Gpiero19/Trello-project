const { Card, List } = require('../models');

exports.createCard = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const { title, listId, guestId } = req.body;

    const maxPosition = await Card.max('position', {
      where: { listId, ...(userId ? { userId } : { guestId }) }
    });
    const position = Number.isFinite(maxPosition) ? maxPosition + 1 : 0;

    const card = await Card.create({ title, listId, position, userId, guestId });

    res.status(201).json(card);
  } catch (err) {
    console.error('Error creating card:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllCards = async (req, res) => {
  const userId = req.user?.id || null;
  const guestId = req.query.guestId || null;
  const { listId } = req.query; // optional filter by list

  try {
    const whereClause = {
      ...(listId ? { listId } : {}),
      ...(userId ? { userId } : { guestId })
    };
    const cards = await Card.findAll({ where: whereClause, order: [['position', 'ASC']] });
    res.status(200).json(cards);
  } catch (err) {
    console.error('Error fetching cards', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getCardById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id || null;
  const guestId = req.query.guestId || null;

  try {
    const card = await Card.findOne({ where: { id, ...(userId ? { userId } : { guestId }) } });
    if (!card) return res.status(404).json({ error: 'Card not found' });
    res.status(200).json(card);
  } catch (err) {
    console.error('Error fetching card:', err);
    res.status(500).json({ error: 'Card not found' });
  }
};

exports.updateCard = async (req, res) => {
  const { id } = req.params;
  const { title, description, guestId } = req.body;
  const userId = req.user?.id || null;

  try {
    const card = await Card.findOne({ where: { id, ...(userId ? { userId } : { guestId }) } });
    if (!card) return res.status(404).json({ error: 'Card not found' });

    if (title !== undefined) card.title = title;
    if (description !== undefined) card.description = description;

    await card.save();
    res.status(200).json(card);
  } catch (err) {
    console.error('Error updating card:', err);
    res.status(500).json({ error: 'Error updating card' });
  }
};

exports.deleteCard = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id || null;
  const guestId = req.query.guestId || null;

  try {
    const card = await Card.findOne({ where: { id, ...(userId ? { userId } : { guestId }) } });
    if (!card) return res.status(404).json({ error: 'Card not found' });

    await card.destroy();
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting card:', err);
    res.status(500).json({ error: 'Error deleting card' });
  }
};

exports.reorderCards = async (req, res) => {
  try {
    const { cards, guestId } = req.body;
    const userId = req.user?.id || null;

    const updates = cards.map(({ id, listId, position }) =>
      Card.update(
        { listId, position },
        { where: { id, ...(userId ? { userId } : { guestId }) } }
      )
    );

    await Promise.all(updates);
    res.status(200).json({ message: 'Cards reordered successfully' });
  } catch (err) {
    console.error('Error reordering cards', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
