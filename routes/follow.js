const express = require('express');
const router = express.Router();
const ctrls = require('../controllers');
const authRequired = require('../middleware/authRequired');

router.post('/follow/:username', authRequired, ctrls.follow.followUser);
router.post('/unfollow/:username', authRequired, ctrls.follow.unfollowUser);
router.get('/followers/:username', ctrls.follow.fetchFollowers)
router.get('/following/:username', ctrls.follow.fetchFollowingList)

module.exports = router;
