const express = require('express');
const router = express.Router();
const { getUserInfo, getFaculties } = require('../controllers/userController.js');
const { check } = require('../middlewares/roleCheck.js');

router.get('/', check, getUserInfo);
router.get('/faculties', check, getFaculties);

module.exports = userRouter = router;