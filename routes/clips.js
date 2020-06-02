const express = require('express');
const router = express.Router();
const ctrls = require('../controllers');
const authRequired = require('../middleware/authRequired');
const upload = require('../middleware/multer');

router.get('/', ctrls.clips.indexClips);
router.get('/browseclips', ctrls.clips.indexBrowseClips);
router.get('/clips/:username', ctrls.clips.indexUserClips);
router.get('/clip/:id', ctrls.clips.showClip);
router.post('/', authRequired, upload.single('clip'), ctrls.clips.uploadClip);
router.put('/:id', authRequired, ctrls.clips.editClip);
router.delete('/:id', authRequired, ctrls.clips.deleteClip);

module.exports = router;