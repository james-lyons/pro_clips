const express = require('express');
const router = express.Router();
const ctrls = require('../controllers');
const authRequired = require('../middleware/authRequired');

router.get('/comments', ctrls.comments.indexComments);
router.get('/comments/:id', ctrls.comments.showComment);
router.get('/responses', ctrls.comments.indexResponses);
router.get('/responses/:id', ctrls.comments.showResponse);
router.post('/comments', ctrls.comments.createComment);
router.post('/response', ctrls.comments.createResponse);
router.post('/comments/:id', ctrls.comments.editComment);
router.post('/response/:id', ctrls.comments.editResponse);
router.delete('/comments/:id', ctrls.comments.deleteComment);
router.delete('/response/:id', ctrls.comments.deleteResponse);

module.exports = router;