const express = require('express');
const router = express.Router();
const ctrls = require('../controllers');
const authRequired = require('../middleware/authRequired');

router.get('/', ctrls.comments.indexComments);
router.get('/:id', ctrls.comments.showComment);
router.post('/', authRequired, ctrls.comments.createComment);
router.put('/:id', authRequired, ctrls.comments.editComment);
router.delete('/:id', authRequired, ctrls.comments.deleteComment);

module.exports = router;