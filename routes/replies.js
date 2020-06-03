const express = require('express');
const router = express.Router();
const ctrls = require('../controllers');
const authRequired = require('../middleware/authRequired');

router.get('/', ctrls.replies.indexReplies);
router.get('/:id', ctrls.replies.showReply);
router.post('/', ctrls.replies.createReply);
router.put('/:id', ctrls.replies.editReply);
router.delete('/:id', ctrls.replies.deleteReply);

module.exports = router;