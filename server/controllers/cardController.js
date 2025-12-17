const { Card, List } = require('../models');

exports.createCard = async (req, res) => {
  try {
    const { title, listId } = req.body;

    const maxPosition = await Card.max('position', {
      where: { listId }
    });
    const position = Number.isFinite(maxPosition) ? maxPosition + 1 : 0;

    const card = await Card.create({ title, listId, position });
    res.status(201).json(card);
  } catch (err) {
    console.error('Error creating card:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllCards = async (req, res) => {
  const { listId } = req.query; // optional filter by list

  try {
    const whereClause = {
      ...(listId ? { listId } : {})
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

  try {
    const card = await Card.findOne({ where: { id } });
    if (!card) return res.status(404).json({ error: 'Card not found' });
    res.status(200).json(card);
  } catch (err) {
    console.error('Error fetching card:', err);
    res.status(500).json({ error: 'Card not found' });
  }
};

exports.updateCard = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const card = await Card.findOne({ where: { id } });
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

  try {
    const card = await Card.findOne({ where: { id } });
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
    const { cards } = req.body;

    const updates = cards.map(({ id, listId, position }) =>
      Card.update(
        { listId, position },
        { where: { id } }
      )
    );

    await Promise.all(updates);
    res.status(200).json({ message: 'Cards reordered successfully' });
  } catch (err) {
    console.error('Error reordering cards', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
