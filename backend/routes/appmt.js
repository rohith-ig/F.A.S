const express = require("express");
const router = express.Router();
const { postAppointmentRequest, getAppointments, updateAppointmentStatus } = require("../controllers/appointmentController");
const { check } = require("../middlewares/roleCheck");

router.post("/", check, postAppointmentRequest);
router.get("/", check, getAppointments);
router.post("/update/:id",check,updateAppointmentStatus);

module.exports = router;