const express = require('express');
const router = express.Router();
const { getUserInfo } = require('../controllers/userController.js');
const { check } = require('../middlewares/roleCheck.js');

router.get('/', check, getUserInfo);

module.exports = userRouter = router;