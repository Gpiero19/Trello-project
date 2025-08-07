const { Card } = require('../models');

exports.createCard = async (req, res) => {
  try {
    const { title, listId, description } = req.body;
    const card = await Card.create({ title, listId }); //creation of card

    res.status(201).json(card);

  } catch (err) {
    console.error('Error creating card:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllCards = async (req, res) => {
    try {
        const cards = await Card.findAll(); //fetch card from DB
        res.status(200).json(cards)
    } catch (err) {
        console.error('Error fetching cards', err)
        res.status(500).json({error: 'Internal server error'})
    } 
};

exports.getCardById = async (req, res) => {
  const {id} = req.params;
  try {
    const card = await Card.findByPk(id);
    if (!card) return res.status(404).json({ error: 'Card not found'});
    res.status(200).json(card)
  } catch (err) {
    res.status(500).json({ error: 'Card not found'})
  }
}

exports.updateCard = async (req, res) => {
  const {id} = req.params;
  const {title, description} = req.body

  try {
    const card = await Card.findByPk(id)
    if (!card) return res.status(404).json({ error: 'Card not found'})

    if (title !== undefined) card.title  = title                            //update if it is provided
    if (description !== undefined) card.description  = description

    await card.save();

    res.status(200).json(card)
  } catch (err) {
    res.status(500).json({ error: 'Error updating card'})
  }
}

exports.deleteCard = async (req, res) => {
  const {id} = req.params
  try {
    const card = await Card.findByPk(id)
    if (!card) return res.status(404).json({ error: 'Card not found'})

    await card.destroy()
    res.status(204).send()
  } catch (err) {
    res.status(500).json({error: 'Error deleting card'})
  }
}; 