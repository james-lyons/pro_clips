const express = require('express');
const router = express.Router();
const ctrls = require('../controllers');

router.get('/register/confirm/:confirmToken', ctrls.auth.confirmEmail);
router.post('/register', ctrls.auth.register);
router.post('/login', ctrls.auth.login);
router.post('/logout', ctrls.auth.logout);

module.exports = router;
