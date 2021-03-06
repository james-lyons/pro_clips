const express = require('express');
const router = express.Router();
const ctrls = require('../controllers');
const authRequired = require('../middleware/authRequired');

router.get('/:clipId', ctrls.comments.indexComments);
router.post('/', authRequired, ctrls.comments.createComment);
router.delete('/:id', authRequired, ctrls.comments.deleteComment);
router.post('/like/:id', authRequired, ctrls.comments.likeComment);
router.post('/unlike/:id', authRequired, ctrls.comments.unlikeComment);

module.exports = router;