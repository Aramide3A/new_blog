const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const userSchema = require('../models/user.model');
require('dotenv').config()

const Secret_key = process.env.SECRET_KEY

const registerController = async (req, res) => {
    try {
        const { email, first_name, last_name, password } = req.body;

        const check_user = await userSchema.findOne({ email });
        if (check_user) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const hash_pass = await bcrypt.hash(password, 10);
        const create_user = new userSchema({ email, first_name, last_name, password: hash_pass });
        await create_user.save();

        const payload = { email };
        const token = jwt.sign(payload, Secret_key, { expiresIn: '1h' });

        res.status(200).json({ message: 'Registration successful!', token });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userSchema.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = { email };
        const token = jwt.sign(payload, Secret_key, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful!', token });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerController, loginController }