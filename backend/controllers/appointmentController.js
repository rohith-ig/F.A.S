const prisma = require('../config/database.js');

const postAppointmentRequest = async (req, res) => {
    try {
        if (req.user.role !== 'STUDENT') {
            return res.status(403).json({ error: 'Only students can create appointment requests' });
        }
        const { facultyId, start, duration, purpose, note, capacity = 1, isGroup = false } = req.body;

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
                note: note,
                capacity: capacity
            }
        });
        const addUserGroup = await prisma.appointmentUsers.create({
            data: {
                appointmentId: create.id,
                userId: req.user.studentProfile.id
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
                where: 
                { 
                    OR : [
                        { studentId: req.user.studentProfile.id },
                        { students : {
                                some : {
                                    userId : req.user.studentProfile.id
                                }
                            } 
                        }
                    ]
                },
                include : {
                    faculty : {
                        include : {
                            user : {
                                select : {
                                    name : true,
                                    email : true,
                                }
                            }
                        }
                    },
                    students : {
                        include : {
                            student : {
                                include : {
                                    user : {
                                        select : {
                                            name : true,
                                            email : true
                                        }
                                    }
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
                    students : {
                        include : {
                            student : {
                                include : {
                                    user : {
                                        select : {
                                            name : true,
                                            email : true
                                        }
                                    }
                                }
                            }
                        }
                    }
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

const addGroupMember = async (req,res) => {
    try {
        const { appmtId, email } = req.body;
        const user = await prisma.user.findUnique({
            where : {email : email},
            include : {
                studentProfile : true
            }
        });
        if(!user || user.role !== 'STUDENT') {
            return res.status(404).json({error : "User not found"});
        }
        const appmt = await prisma.appointmentRequest.findUnique({
            where : {id : Number(appmtId)},
            include : {
                _count : {
                    select : {
                        students : true
                    }
                }
            }
        });
        if(!appmt || appmt.studentId !== req.user.studentProfile.id) {
            return res.status(404).json({error : "Appointment not found"});
        }
        if (!appmt.isGroup) {
            return res.status(400).json({error : "This appointment is not a group appointment"});
        }
        const currentMembers = appmt._count.students;
        if (currentMembers >= appmt.capacity) {
            return res.status(400).json({error : "Appointment capacity reached"});
        }
        const existingMember = await prisma.appointmentUsers.findFirst({
            where : {
                appointmentId : Number(appmtId),
                userId : user.studentProfile.id
            }
        });
        if(existingMember) {
            return res.status(400).json({error : "User is already a member of this appointment"});
        }
        const addUserGroup = await prisma.appointmentUsers.create({
            data: {
                appointmentId: Number(appmtId),
                userId: user.studentProfile.id
            }
        });
        res.json({success : addUserGroup});
    }   
    catch (e) {
        console.log(e);
        res.status(500).json({"Error": "Internal Server Error"});
    } 
}

module.exports = {
    postAppointmentRequest,
    getAppointments,
    updateAppointmentStatus,
    addGroupMember
};