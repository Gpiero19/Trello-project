const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ok, created, notFound, unauthorized, badRequest, serverError } = require('../middleware/responseFormatter');

const SECRET_KEY = process.env.SECRET_KEY;

exports.login = async(req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.findOne({ where: {email}})
        if (!user) return notFound(res, 'User not found', 'No user found with this email');

        const valid = await bcrypt.compare(password, user.password)
        if (!valid) return unauthorized(res, 'Invalid credentials', 'Email or password is incorrect');
        
        const token = jwt.sign({ id: user.id, email: user.email}, SECRET_KEY, 
            {expiresIn: '2h'});

        return ok(res, { 
            token, 
            user: {id: user.id, name: user.name, email: user.email } 
        }, 'Login successful');

    } catch(err) {
        return serverError(res, 'Server error during login');
    }
};

exports.register = async(req,res) => {
    const {name, email, password} = req.body;

    try {
        let existingUser = await User.findOne({ where: {email}})

        if (existingUser) {
            return badRequest(res, 'User already exists', 'A user with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword});

        return created(res, { 
            user: { id: user.id, name: user.name, email: user.email }
        }, 'User registered successfully');

    } catch (err) {
        return badRequest(res, 'Registration failed', err.message);
    }
}
