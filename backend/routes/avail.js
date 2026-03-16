const express = require('express');
const router = express.Router();
const { check } = require('../middlewares/roleCheck.js');
const { getAvailability, createAvailability } = require('../controllers/availController.js');

router.get('/', check, getAvailability);
router.post('/', check, createAvailability);

module.exports = router;