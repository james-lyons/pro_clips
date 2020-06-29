const express = require('express');
const router = express.Router();
const ctrls = require('../controllers');
const authRequired = require('../middleware/authRequired');

router.post('/clip', authRequired, ctrls.reports.reportClip);
router.post('/user', authRequired, ctrls.reports.reportUser);
router.post('/reply', authRequired, ctrls.reports.reportReply);
router.post('/comment', authRequired, ctrls.reports.reportComment);

module.exports = router;
