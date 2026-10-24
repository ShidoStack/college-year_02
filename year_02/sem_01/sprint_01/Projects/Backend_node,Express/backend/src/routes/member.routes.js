const express = require('express');
const router = express.Router();
const memberController = require('../controllers/member.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

// Librarian only
router.get('/', requireAuth, requireRole('librarian', 'admin'), memberController.getMembers);
router.get('/:id', requireAuth, requireRole('librarian', 'admin'), memberController.getMember);
router.post('/', requireAuth, requireRole('librarian', 'admin'), memberController.createMember);
router.put('/:id', requireAuth, requireRole('librarian', 'admin'), memberController.updateMember);

module.exports = router;
