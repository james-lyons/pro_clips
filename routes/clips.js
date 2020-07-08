const express = require('express');
const router = express.Router();
const ctrls = require('../controllers');
const upload = require('../middleware/multer');
const authRequired = require('../middleware/authRequired');

router.get('/clip/:id', ctrls.clips.showClip);
router.get('/browseclips', ctrls.clips.indexBrowseClips);
router.get('/clips/game/:game', ctrls.clips.indexGameClips);
router.get('/clips/:username', ctrls.clips.indexUserClips);
router.post('/', authRequired, upload.single('clip'), ctrls.clips.uploadClip);
router.put('/:id', authRequired, ctrls.clips.editClip);
router.delete('/:id', authRequired, ctrls.clips.deleteClip);
router.post('/like/:id', authRequired, ctrls.clips.likeClip);
router.post('/unlike/:id', authRequired, ctrls.clips.unlikeClip);

module.exports = router;
