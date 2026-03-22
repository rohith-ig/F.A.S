const jwt = require('jsonwebtoken');
const prisma = require('../config/database.js');

const getAvailability = async (req, res) => {
  try {
    const facultyId = Number(req.query.facultyId || req.user?.facultyProfile?.id);
    const now = new Date();
    const availability = await prisma.facultyAvailability.findMany({
      where: {
        ...(facultyId && { facultyId }),
        start: {
          gte: now,
        },
      },
      orderBy: {
        start: "asc",
      },
      select: {
        facultyId: true,
        faculty : {
            select : {
                user : {
                    select : {
                        name : true,
                        email : true
                    }
                },
                department : true,
                designation : true
            }
        },
        start: true,
        end: true,
      },
    });
    const appointments = await prisma.appointmentRequest.findMany({
      where: {
        ...(facultyId && { facultyId }),
        status: "APPROVED",
        start: {
          gte: now,
        },
      },
      select: {
        facultyId: true,
        start: true,
        end: true,
      },
    });
    const freeSlots = subtractIntervals(availability, appointments);
    res.json(freeSlots);
  } catch (error) {
    console.error("Error fetching availability:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



function subtractIntervals(availabilities, appointments) {
  const result = [];
  for (const slot of availabilities) {

    let intervals = [
      {
        start: slot.start,
        end: slot.end,
      },
    ];

    const relevantAppointments = appointments.filter(
      (appt) =>
        appt.facultyId === slot.facultyId &&
        appt.start < slot.end &&
        appt.end > slot.start
    );

    for (const appt of relevantAppointments) {
      const newIntervals = [];

      for (const interval of intervals) {
        if (appt.end <= interval.start || appt.start >= interval.end) {
          newIntervals.push(interval);
          continue;
        }
        if (appt.start > interval.start) {
          newIntervals.push({
            start: interval.start,
            end: appt.start,
          });
        }
        if (appt.end < interval.end) {
          newIntervals.push({
            start: appt.end,
            end: interval.end,
          });
        }
      }

      intervals = newIntervals;
    }
    for (const interval of intervals) {
      result.push({
        facultyId: slot.facultyId,
        start: interval.start,
        end: interval.end,
        faculty: slot.faculty
      });
    }
  }

  return result;
}

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