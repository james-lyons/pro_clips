const express = require('express');
const router = express.Router();
const ctrls = require('../controllers');
const authRequired = require('../middleware/authRequired');

router.get('/user/:username', ctrls.accounts.fetchUser);
router.get('/users/:search', ctrls.accounts.searchUsers);
router.get('/currentuser/:id', authRequired, ctrls.accounts.fetchCurrentUser);
router.delete('/:id', authRequired, ctrls.accounts.deleteUser);
router.put('/:id/profile', authRequired, ctrls.accounts.editUserProfile);
router.put('/:id/email', authRequired, ctrls.accounts.editUserEmail);
router.put('/:id/password', authRequired, ctrls.accounts.editUserPassword);
router.post('/password/recover', ctrls.accounts.recoverPassword);
router.post('/password/reset/:userId/:resetToken', ctrls.accounts.resetPassword);

module.exports = router;