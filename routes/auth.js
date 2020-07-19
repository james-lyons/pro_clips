const express = require('express');
const router = express.Router();
const ctrls = require('../controllers');

router.post('/login', ctrls.auth.login);
router.post('/logout', ctrls.auth.logout);
router.post('/register', ctrls.auth.register);
router.get('/register/resend/:email', ctrls.auth.resendConfirmation);
router.get('/register/confirm/:confirmToken', ctrls.auth.confirmEmail);

module.exports = router;
