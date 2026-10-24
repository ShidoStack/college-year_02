const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

// Public: anyone authenticated can view books
router.get('/', requireAuth, bookController.getBooks);
router.get('/:id', requireAuth, bookController.getBook);

// Librarian only: add / update / delete
router.post('/', requireAuth, requireRole('librarian', 'admin'), bookController.createBook);
router.put('/:id', requireAuth, requireRole('librarian', 'admin'), bookController.updateBook);
router.delete('/:id', requireAuth, requireRole('librarian', 'admin'), bookController.deleteBook);

module.exports = router;
