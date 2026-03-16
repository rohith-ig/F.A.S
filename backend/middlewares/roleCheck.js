const jwt = require('jsonwebtoken');
const prisma = require('../config/database.js');

const check = async (req, res, next) => {
    let token = req.headers['authorization'];
    if (!token) {
        res.status(401).json({ error: 'No token provided' });
        console.log("Token Issue");
        return;
    }
    token = token.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({ where: { id : decoded.userId } , include: { facultyProfile: true, studentProfile: true } });
        req.user = user;
        console.log(user);
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = { check };