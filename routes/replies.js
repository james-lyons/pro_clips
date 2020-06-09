const express = require('express');
const router = express.Router();
const ctrls = require('../controllers');
const authRequired = require('../middleware/authRequired');

router.get('/', ctrls.replies.indexReplies);
router.post('/:id', ctrls.replies.createReply);
router.post('/like/:id', authRequired, ctrls.clips.likeClip);
router.post('/unlike/:id', authRequired, ctrls.clips.unlikeClip);
router.delete('/:id', ctrls.replies.deleteReply);

module.exports = router;