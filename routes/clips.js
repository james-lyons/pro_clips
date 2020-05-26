const express = require('express');
const router = express.Router();
const ctrls = require('../controllers');
const authRequired = require('../middleware/authRequired');
const clip = require('../middleware/gridFs');

// router.get('/', ctrls.clips.indexClips);
// router.get('/:id', ctrls.clips.showClip);
router.post('/', authRequired, clip.single('clip'), ctrls.clips.createClip);
// router.put('/:id', authRequired, ctrls.clips.editClip);
// router.delete('/:id', authRequired, ctrls.clips.deleteClip);

module.exports = router;