const express = require('express');
const router = express.Router();
const ctrls = require('../controllers');
const authRequired = require('../middleware/authRequired');

router.get('/', ctrls.replies.indexReplies);
router.post('/:id', authRequired, ctrls.replies.createReply);
router.delete('/:id', authRequired, ctrls.replies.deleteReply);
router.post('/like/:id', authRequired, ctrls.replies.likeReply);
router.post('/unlike/:id', authRequired, ctrls.replies.unlikeReply);

module.exports = router;