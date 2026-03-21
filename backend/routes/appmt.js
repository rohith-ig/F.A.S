const express = require("express");
const router = express.Router();
const { postAppointmentRequest, getAppointments, updateAppointmentStatus, addGroupMember } = require("../controllers/appointmentController");
const { check } = require("../middlewares/roleCheck");

router.post("/", check, postAppointmentRequest);
router.get("/", check, getAppointments);
router.post("/update/:id",check,updateAppointmentStatus);
router.post("/addMember",check,addGroupMember);

module.exports = router;