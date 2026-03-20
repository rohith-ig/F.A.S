const prisma = require('../config/database.js');

const postAppointmentRequest = async (req, res) => {
    try {
        if (req.user.role !== 'STUDENT') {
            return res.status(403).json({ error: 'Only students can create appointment requests' });
        }
        const { facultyId, start, duration, purpose, note } = req.body;
        if (!facultyId || !start || !duration || !purpose) {
            return res.status(400).json({ error: 'Missing required fields' });
        }   
        const checkAvail = await prisma.facultyAvailability.findFirst({
            where: {
                facultyId: facultyId,
                start: {
                    lte: new Date(start)
                },
                end: {
                    gte: new Date(new Date(start).getTime() + duration * 60000)
                }
            }
        });
        if (!checkAvail) {
            return res.status(400).json({ error: 'The selected time slot is not available for the chosen faculty member' });
        }
        const existingCheck = await prisma.appointmentRequest.findFirst({
            where: {
                facultyId: facultyId,
                start : {
                    lt : new Date(new Date(start).getTime() + duration * 60000)
                },
                end : {
                    gt : new Date(start)
                },
                status: 'APPROVED'
            }
        });
        if(existingCheck) {
            return res.status(400).json({ error: 'The selected time slot overlaps with an already approved appointment' });
        }
        const create = await prisma.appointmentRequest.create({
            data: {
                studentId: req.user.studentProfile.id,
                facultyId: facultyId,
                start: new Date(start),
                end : new Date(new Date(start).getTime() + duration * 60000),
                purpose: purpose,
                note: note
            }
        });
        res.status(201).json(create);
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const getAppointments = async (req, res) => {
    try {
        let appointments;
        if (req.user.role === 'STUDENT') {
            appointments = await prisma.appointmentRequest.findMany({
                where: { studentId: req.user.studentProfile.id },
                include: {
                    faculty: {
                        include: {
                            user: {
                                select: {
                                    name: true,
                                    email: true
                                }
                            }
                        }
                    }
                },
                orderBy: { start: 'asc' },
            });     
        }
        else if (req.user.role === 'FACULTY') {
            appointments = await prisma.appointmentRequest.findMany({
                where: { facultyId: req.user.facultyProfile.id },
                include: {
                    student: {
                        select: {
                            id: true,
                            department: true,
                            designation: true,
                            designation : true,
                            rollNumber : true,
                            user : {
                                select : { 
                                    name : true,
                                    email : true
                                    }
                                }
                        }
                },
            },
                orderBy: { start: 'asc' },
            });     
        }
        else {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        res.json(appointments); 
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ error: 'Internal server error' });
    }   
}

const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, cancel } = req.body;
        if (req.user.role !== 'FACULTY') {
            return res.status(403).json({ error: 'Only faculty members can update appointment status' });
        }
        const appointment = await prisma.appointmentRequest.findUnique({
            where: { id: Number(id) },
        });
        if (!appointment || appointment.facultyId !== req.user.facultyProfile.id) {
            return res.status(404).json({ error: 'Appointment request not found' });
        }
        if (appointment.status === 'REJECTED' || appointment.status === 'CANCELLED') {
            return res.status(400).json({ error: 'This appointment has already been rejected' });
        }
        if (!['APPROVED', 'REJECTED', 'CANCELLED'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status value' });
        }
        if (appointment.status === 'APPROVED') {
            if (status !== 'CANCELLED') {
                return res.status(400).json({error : 'This appointment is confirmed and can only be cancelled'});
            }
            const update = await prisma.appointmentRequest.update({
                where : {id : Number(id)},
                data: {status : status, cancellationNote: cancel}
            });
            return res.json({success:update})
        }
        if (appointment.status === 'PENDING') {
            if (status === 'APPROVED') {
                const updateMain = await prisma.appointmentRequest.update({
                    where : {id : Number(id)},
                    data: {status : status}
                });
                const updateOthers = await prisma.appointmentRequest.updateMany({
                    where : {
                        facultyId : appointment.facultyId,
                        status : "PENDING",
                        start : {
                            lt : appointment.end
                        },
                        end : {
                            gt : appointment.start
                        }
                    },
                    data : {
                        status : "REJECTED",
                        cancellationNote : "This appointment was automatically rejected because the time slot was taken by another approved appointment."
                    }
                });
                return res.json(updateMain);
            }
            if (status === 'REJECTED') {
                const updateMain = await prisma.appointmentRequest.update({
                    where : {id : Number(id)},
                    data: {status : status, cancellationNote: cancel}
                });
                return res.json(updateMain);
            }
            return res.status(400).json({ error: 'Invalid status transition' });
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).json("Internal Server Error");
    }
}

module.exports = {
    postAppointmentRequest,
    getAppointments,
    updateAppointmentStatus
};