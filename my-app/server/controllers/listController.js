const { List } = require('../models');

exports.createList = async (req, res) => {
  try {
    const { title, boardId } = req.body;
    const list = await List.create({ title, boardId }); //creation of list

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
  const {id} = req.params;
  try {
    const list = await List.findByPk(id);
    if (!list) return res.status(404).json({ error: 'List not found'});
    res.status(200).json(list)
  } catch (err) {
    res.status(500).json({ error: 'List not found'})
  }
}

exports.updateList = async (req, res) => {
  const {id} = req.params;
  const {title} = req.body
  
  try {
    const list = await List.findByPk(id)
    if (!list) return res.status(404).json({ error: 'List not found'})
    
    list.title = title
    await list.save();

    res.status(200).json(list)
  } catch (err) {
    res.status(500).json({ error: 'Error updating list'})
  }
}

exports.deleteList = async (req, res) => {
  const {id} = req.params
  try {
    const list = await List.findByPk(id)
    if (!list) return res.status(404).json({ error: 'List not found'})

    await list.destroy()
    res.status(204).send()
  } catch (err) {
    res.status(500).json({error: 'Error deleting list'})
  }
}; 