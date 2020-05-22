const express = require('express');
const router = express.Router();
const ctrls = require('../controllers');
const authRequired = require('../middleware/authRequired');

router.get('/', ctrls.accounts.fetchUsers);
router.get('/currentuser/:id', authRequired, ctrls.accounts.fetchCurrentUser);
router.get('/user/:userName', ctrls.accounts.fetchUser);
router.put('/:id/profile', authRequired, ctrls.accounts.editUserProfile);
router.put('/:id/password', authRequired, ctrls.accounts.editUserPassword);
router.put('/:id/email', authRequired, ctrls.accounts.editUserEmail);
router.delete('/:id', authRequired, ctrls.accounts.deleteUser);

module.exports = router;