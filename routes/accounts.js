const express = require('express');
const router = express.Router();
const ctrls = require('../controllers');
const authRequired = require('../middleware/authRequired');

router.get('/', ctrls.accounts.fetchUsers);
router.get('/:id', authRequired, ctrls.accounts.fetchUser);
router.put('/:id', authRequired, ctrls.accounts.fetchUser);
router.delete('/:id', authRequired, ctrls.accounts.fetchUser);

module.exports = router;