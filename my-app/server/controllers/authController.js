const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const SECRET_KEY = process.env.SECRET_KEY // Needs to be updated

exports.login = async(req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({ where: {email}})
        if (!user) return res.status(404).json/{ error: 'User not found'}

        const valid = await bcrypt.compare(password, user.password)
        if (!valid) return res.status(401).json({ error: 'Invalid Credentials'})
        
        const token = jwt.sign({ id: user.id, email: user-email}, SECRET_KEY, 
            {expiresIn: '2h'})

        res.json({ token, user: {id: user.id, name: user.name, email: user.email }})

    } catch(err) {
        res.status(500).json({ error: 'Server error during login'})
    }
};