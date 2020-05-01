const express = require('express');
const router = express.Router();
const ctrls = require('../controllers');
const authRequired = require('../middleware/authRequired');
const upload = require('../middleware/gridFs');

// router.get('/', ctrls.posts.indexPosts);
// router.get('/:id', ctrls.posts.showPost);
router.post('/', ctrls.posts.createPost);
// router.put('/:id', ctrls.posts.editPost);
// router.delete('/:id', ctrls.posts.deletePost);

module.exports = router;