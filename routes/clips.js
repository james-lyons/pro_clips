const express = require('express');
const router = express.Router();
const ctrls = require('../controllers');
const authRequired = require('../middleware/authRequired');
const upload = require('../middleware/multer');

router.get('/browseclips', ctrls.clips.indexBrowseClips);
router.get('/clips/game/:game', ctrls.clips.indexGameClips);
router.get('/clips/:username', ctrls.clips.indexUserClips);
router.get('/clip/:id', ctrls.clips.showClip);
router.post('/', authRequired, upload.single('clip'), ctrls.clips.uploadClip);
router.post('/like/:id', authRequired, ctrls.clips.likeClip);
router.post('/unlike/:id', authRequired, ctrls.clips.unlikeClip);
router.put('/:id', authRequired, ctrls.clips.editClip);
router.delete('/:id', authRequired, ctrls.clips.deleteClip);

module.exports = router;