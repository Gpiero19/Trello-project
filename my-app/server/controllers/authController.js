const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const SECRET_KEY = process.env.SECRET_KEY

exports.login = async(req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({ where: {email}})
        if (!user) return res.status(404).json({ error: 'User not found'})

        const valid = await bcrypt.compare(password, user.password)
        if (!valid) return res.status(401).json({ error: 'Invalid Credentials'})
        
        const token = jwt.sign({ id: user.id, email: user.email}, SECRET_KEY, 
            {expiresIn: '2h'})

        res.json({ token, user: {id: user.id, name: user.name, email: user.email }})

    } catch(err) {
        res.status(500).json({ error: 'Server error during login'})
    }
};

exports.register = async(req,res) => {
    const {name, email, password} = req.body;

    try {
        let existingUser = await User.findOne({ where: {email}})

        if (existingUser) {
            return res.status(400).send('User already exisits. Please sign in')
        } else {

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({ name, email, password: hashedPassword})

        return res.status(201).json(user)}
        
    } catch (err) {
        return res.status(400).json({ message: err.message })
    }
}