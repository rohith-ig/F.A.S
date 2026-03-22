const express = require("express");

const {
  uploadFacultySlot,
  editFacultySlot,
  deleteFacultySlot,
  uploadCSVTimetable,
  uploadManualSlots
} = require("../controllers/adminController");

const router = express.Router();

// Create a slot
router.post("/upload-timetable", uploadFacultySlot);

// Update/edit a slot
router.put("/edit-timetable", editFacultySlot);

// Delete a slot
router.delete("/delete-timetable", deleteFacultySlot);

// Upload timetable via CSV
router.post("/upload-csv", uploadCSVTimetable);

//manual upload
router.post("/upload-slots", uploadManualSlots);

module.exports = router;