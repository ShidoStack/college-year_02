const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

// All report routes are librarian-only
router.get('/borrowing', requireAuth, requireRole('librarian', 'admin'), reportController.getBorrowingReport);
router.get('/popular-books', requireAuth, requireRole('librarian', 'admin'), reportController.getPopularBooksReport);
router.get('/member-activity', requireAuth, requireRole('librarian', 'admin'), reportController.getMemberActivityReport);

module.exports = router;
