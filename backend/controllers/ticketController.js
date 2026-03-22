const prisma = require("../config/database"); 

// CREATE TICKET (Student)
exports.createTicket = async (req, res) => {
  try {
    const { topic, description } = req.body;

    const newTicket = await prisma.ticket.create({
      data: {
        topic: topic,
        description: description,
        userId: req.user.id, // from auth middleware
      },
    });

    res.status(201).json({success:true, ticket:newTicket});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create ticket" });
  }
};

// GET ALL TICKETS (Admin)
exports.getTickets = async (req, res) => {
  try {
    const tickets = await prisma.ticket.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
};

// GET USER TICKETS (Student)
exports.getMyTickets = async (req, res) => {
  try {
    const tickets = await prisma.ticket.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(tickets);

  } catch (err) { 
    res.status(500).json({ error: "Failed to fetch user tickets" }); 
  } 
};

// RESOLVE TICKET (Admin)
exports.resolveTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedTicket = await prisma.ticket.update({
      where: { id: parseInt(id) },
      data: { ticketStatus: "RESOLVED" }
    });

    res.status(200).json({ success: true, ticket: updatedTicket });
  } catch (err) {
  console.error(err)
    res.status(500).json({ error: "Failed to resolve ticket" });
  }
};
