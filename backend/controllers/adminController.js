const prisma = require("../prismaClient");

exports.uploadFacultySlot = async (req, res) => {
  try {
    const { facultyId, start, end } = req.body;

    const slot = await prisma.facultyAvailability.create({
      data: {
        facultyId: facultyId,
        start: new Date(start),
        end: new Date(end),
      },
    });

    res.json({
      message: "Timetable slot added",
      slot,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error creating slot",
    });
  }
};


exports.editFacultySlot = async (req, res) => {
  try {
    const { slotId, facultyId, start, end } = req.body;

    const updatedSlot = await prisma.facultyAvailability.update({
      where: { id: slotId },
      data: {
        facultyId,
        start: start ? new Date(start) : undefined,
        end: end ? new Date(end) : undefined,
      },
    });

    res.json({
      message: "Timetable slot updated",
      slot: updatedSlot,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating slot",
    });
  }
};

exports.deleteFacultySlot = async (req, res) => {
  try {
    const { slotId } = req.body;

    await prisma.facultyAvailability.delete({
      where: { id: slotId },
    });

    res.json({
      message: "Timetable slot deleted",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error deleting slot",
    });
  }
};

/* SLOT MAP (same as frontend) */
const slotMap = {
  F:[["Mon","08:00-08:50"],["Tue","05:00-05:50"],["Thu","08:00-08:50"]],
  H:[["Tue","08:00-08:50"],["Wed","05:00-05:50"],["Fri","08:00-08:50"]],
  G:[["Wed","08:00-08:50"],["Mon","05:00-05:50"],["Thu","05:00-05:50"]],

  A1:[["Mon","09:00-09:50"],["Thu","11:00-11:50"],["Fri","10:00-10:50"],["Wed","12:00-12:50"]],
  B1:[["Mon","10:00-10:50"],["Tue","09:00-09:50"],["Fri","11:00-11:50"],["Thu","12:00-12:50"]],
  C1:[["Mon","11:00-11:50"],["Tue","10:00-10:50"],["Fri","12:00-12:50"]],
  D1:[["Tue","11:00-11:50"],["Wed","10:00-10:50"],["Thu","09:00-09:50"],["Mon","12:00-12:50"]],
  E1:[["Wed","11:00-11:50"],["Thu","10:00-10:50"],["Fri","09:00-09:50"],["Tue","12:00-12:50"]],

  A2:[["Mon","02:00-02:50"],["Thu","04:00-04:50"],["Fri","03:00-03:50"],["Wed","01:00-01:50"]],
  B2:[["Mon","03:00-03:50"],["Tue","02:00-02:50"],["Fri","04:00-04:50"],["Thu","01:00-01:50"]],
  C2:[["Mon","04:00-04:50"],["Tue","03:00-03:50"],["Wed","02:00-02:50"],["Fri","01:00-01:50"]],
  D2:[["Tue","04:00-04:50"],["Wed","03:00-03:50"],["Thu","02:00-02:50"],["Mon","01:00-01:50"]],
  E2:[["Wed","04:00-04:50"],["Thu","03:00-03:50"],["Fri","02:00-02:50"],["Tue","01:00-01:50"]],

  P1:[["Mon","02:00-02:50"],["Mon","03:00-03:50"],["Mon","04:00-04:50"]],
  Q1:[["Tue","02:00-02:50"],["Tue","03:00-03:50"],["Tue","04:00-04:50"]],
  R1:[["Wed","02:00-02:50"],["Wed","03:00-03:50"],["Wed","04:00-04:50"]],
  S1:[["Thu","02:00-02:50"],["Thu","03:00-03:50"],["Thu","04:00-04:50"]],
  T1:[["Fri","02:00-02:50"],["Fri","03:00-03:50"],["Fri","04:00-04:50"]],

  P2:[["Mon","09:00-09:50"],["Mon","10:00-10:50"],["Mon","11:00-11:50"]],
  Q2:[["Tue","09:00-09:50"],["Tue","10:00-10:50"],["Tue","11:00-11:50"]],
  R2:[["Wed","09:00-09:50"],["Wed","10:00-10:50"],["Wed","11:00-11:50"]],
  S2:[["Thu","09:00-09:50"],["Thu","10:00-10:50"],["Thu","11:00-11:50"]],
  T2:[["Fri","09:00-09:50"],["Fri","10:00-10:50"],["Fri","11:00-11:50"]],
};

exports.uploadCSVTimetable = async (req, res) => {
  try {
    const { data } = req.body;

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ message: "Invalid data format" });
    }

    let insertedCount = 0;

    for (let entry of data) {
      const { faculty, slots } = entry;

      if (!faculty || !slots) continue;

      for (let slot of slots) {

        if (!slotMap[slot]) continue;

        for (let [day, time] of slotMap[slot]) {

          await prisma.timetable.create({
            data: {
              facultyName: faculty,
              day,
              time
            }
          });

          insertedCount++;
        }
      }
    }

    res.json({
      message: "CSV uploaded successfully",
      inserted: insertedCount
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Upload failed"
    });
  }
};

exports.uploadManualSlots = async (req, res) => {
  try {
    const { faculty, slots } = req.body;

    if (!faculty || !slots || slots.length === 0) {
      return res.status(400).json({ message: "Faculty and slots are required" });
    }

    let insertedCount = 0;

    for (let slot of slots) {
      if (!slotMap[slot]) continue;

      for (let [day, time] of slotMap[slot]) {
        await prisma.timetable.create({
          data: {
            facultyName: faculty, // store the name directly
            day,
            time
          }
        });

        insertedCount++;
      }
    }

    res.json({
      message: "Manual slots uploaded successfully",
      inserted: insertedCount
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Manual upload failed"
    });
  }
};