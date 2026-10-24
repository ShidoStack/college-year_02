const borrowService = require('../services/borrow.service');
const { successResponse, errorResponse } = require('../utils/response');

// POST /api/borrow  — Student borrows for self, or librarian issues a book
const borrowBook = async (req, res, next) => {
  try {
    const isLibrarian = req.user.role === 'librarian' || req.user.role === 'admin';
    const memberId = isLibrarian ? (req.body.memberId || req.user._id.toString()) : req.user._id.toString();
    const { bookId } = req.body;
    if (!bookId) {
      return errorResponse(res, 400, 'bookId is required.', 'VALIDATION_ERROR');
    }
    const record = await borrowService.borrowBook({ bookId, memberId });
    return successResponse(res, 201, 'Book borrowed successfully.', record);
  } catch (err) {
    next(err);
  }
};

// PUT /api/borrow/:id/return  — Mark a return
const returnBook = async (req, res, next) => {
  try {
    const record = await borrowService.returnBook(req.params.id);
    return successResponse(res, 200, 'Book returned successfully.', record);
  } catch (err) {
    next(err);
  }
};

// GET /api/borrow  — List borrowings (all for librarian, self for student)
const getBorrowings = async (req, res, next) => {
  try {
    const isLibrarian = req.user.role === 'librarian' || req.user.role === 'admin';
    const query = isLibrarian ? { ...req.query } : { ...req.query, memberId: req.user._id.toString() };
    const records = await borrowService.getBorrowings(query);
    return successResponse(res, 200, 'Borrowings retrieved successfully.', records);
  } catch (err) {
    next(err);
  }
};

// GET /api/borrow/user/:id  — Get borrowings for a specific user
const getBorrowingsByUser = async (req, res, next) => {
  try {
    const records = await borrowService.getBorrowingsByUser(req.params.id);
    return successResponse(res, 200, 'User borrowings retrieved successfully.', records);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  borrowBook,
  returnBook,
  getBorrowings,
  getBorrowingsByUser
};
