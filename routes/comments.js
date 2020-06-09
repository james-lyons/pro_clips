const express = require('express');
const router = express.Router();
const ctrls = require('../controllers');
const authRequired = require('../middleware/authRequired');

router.get('/:clipId', ctrls.comments.indexComments);
router.post('/', authRequired, ctrls.comments.createComment);
router.post('/like/:id', authRequired, ctrls.clips.likeClip);
router.post('/unlike/:id', authRequired, ctrls.clips.unlikeClip);
router.delete('/:id', authRequired, ctrls.comments.deleteComment);

module.exports = router;