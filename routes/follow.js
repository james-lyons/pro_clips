const express = require('express');
const router = express.Router();
const ctrls = require('../controllers');
const authRequired = require('../middleware/authRequired');

router.post('/follow/:userName', authRequired, ctrls.followers.followUser);
router.post('/unfollow/:userName', authRequired, ctrls.followers.unfollowUser);

module.exports = router;
