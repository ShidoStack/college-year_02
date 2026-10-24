const express = require('express');
const router = express.Router();
const fineController = require('../controllers/fine.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

// GET fines — all for librarian, self for student
router.get('/', requireAuth, fineController.getAllFines);

// GET fines for specific user — accessible by auth user
router.get('/user/:id', requireAuth, fineController.getFinesByUser);

// POST calculate fines (recalculate overdue) — librarian only
router.post('/calculate', requireAuth, requireRole('librarian', 'admin'), fineController.calculateFines);

// PUT pay a fine — mark fine as paid
router.put('/:id/pay', requireAuth, fineController.payFine);

module.exports = router;
