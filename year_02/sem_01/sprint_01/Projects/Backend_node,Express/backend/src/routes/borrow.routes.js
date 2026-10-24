const express = require('express');
const router = express.Router();
const borrowController = require('../controllers/borrow.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

// GET borrowings — librarian gets all, student gets their own
router.get('/', requireAuth, borrowController.getBorrowings);

// GET borrowings by user — accessible by authenticated user
router.get('/user/:id', requireAuth, borrowController.getBorrowingsByUser);

// POST borrow — student can borrow for themselves, librarian can issue for anyone
router.post('/', requireAuth, borrowController.borrowBook);

// PUT return — return book
router.put('/:id/return', requireAuth, borrowController.returnBook);

module.exports = router;
