const express = require('express');
const router = express.Router();
const controller = require('../controllers/notificationController');
const { check } = require('../middlewares/roleCheck'); 

router.get('/', check, controller.getNotifications);
router.patch('/:id/read', check, controller.markRead);

module.exports = router;