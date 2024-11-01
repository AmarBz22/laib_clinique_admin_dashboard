const express = require('express');
const { register, login, logout, getMe } = require('../controllers/user');
const authenticateToken = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me',authenticateToken,getMe);
router.post('/logout', logout);

module.exports = router;
