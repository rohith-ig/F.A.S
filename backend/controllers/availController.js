const jwt = require('jsonwebtoken');
const prisma = require('../config/database.js');

const getAvailability = async (req, res) => {
    try {
        let facId = req.body;
        if (!facId) {
            facId = req.user.facultyProfile.id;
        }
        const availability = await prisma.facultyAvailability.findMany({
            where: { facultyId: facId,
                start: {
                    gte: new Date()
                }
             },
            select : {
                start: true,
                end: true,
                facultyId: true,
            },
            orderBy: { start: 'asc' },
        });
        res.json(availability);
    }
    catch (error) {
        console.error('Error fetching availability:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createAvailability = async (req, res) => {
    try {
        const { start, end } = req.body;
        if (req.user.role !== 'FACULTY') {
            return res.status(403).json({ error: 'Only faculty members can create availability slots' });
        }
        if (new Date(start) >= new Date(end)) {
            return res.status(400).json({ error: 'Start time must be before end time' });
        }
        if (new Date(end) <= new Date()) {
            return res.status(400).json({ error: 'End time must be in the future' });
        }
        if (new Date(start).getDate() > new Date().getDate() + 7)  {
            return res.status(400).json({ error: 'Start time must be within the next 7 days' });
        }
        const current = await prisma.facultyAvailability.findFirst({
            where : {
                facultyId : req.user.facultyProfile.id,
                start : {
                    lte : new Date(end)
                },
                end : {
                    gte : new Date(start)
                }
            }
        });
        if(current) {
            return res.status(400).json({ error: 'This time slot overlaps with an existing availability slot' });
        }
        const newSlot = await prisma.facultyAvailability.create({
            data: {
                start: new Date(start),
                end: new Date(end),
                facultyId: req.user.facultyProfile.id,
            },
        });
        res.status(201).json(newSlot);
    } catch (error) {
        console.error('Error creating availability slot:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getAvailability,
    createAvailability,
};  