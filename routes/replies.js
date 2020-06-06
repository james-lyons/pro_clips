const express = require('express');
const router = express.Router();
const ctrls = require('../controllers');
const authRequired = require('../middleware/authRequired');

router.get('/', ctrls.replies.indexReplies);
router.post('/', ctrls.replies.createReply);
router.delete('/:id', ctrls.replies.deleteReply);

module.exports = router;