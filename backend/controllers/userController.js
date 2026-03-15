const jwt = require('jsonwebtoken');
const prisma = require('../config/database.js');

const getUserInfo = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        } 
        res.json(user);
    } catch (error) {
        console.error('Error fetching user info:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getUserInfo,
};
