const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketController");
const {check} = require("../middlewares/roleCheck")

// Student
router.post("/create-ticket", check, ticketController.createTicket);
router.get("/my-tickets", check, ticketController.getMyTickets);

// Admin
router.get("/view-tickets", check, ticketController.getTickets);
router.put("/resolveTicket/:id", check, ticketController.resolveTicket);

module.exports = router;
