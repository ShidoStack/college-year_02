const bookService = require('../services/book.service');
const { successResponse, errorResponse } = require('../utils/response');

const getBooks = async (req, res, next) => {
  try {
    const result = await bookService.getBooks(req.query);
    return successResponse(res, 200, 'Books retrieved successfully.', result);
  } catch (err) {
    next(err);
  }
};

const getBook = async (req, res, next) => {
  try {
    const book = await bookService.getBookById(req.params.id);
    return successResponse(res, 200, 'Book retrieved successfully.', book);
  } catch (err) {
    next(err);
  }
};

const createBook = async (req, res, next) => {
  try {
    const { title, author, isbn, genre, year, totalCopies, availableCopies, description, coverColor, coverTextColor } = req.body;

    if (!title || !author || !isbn) {
      return errorResponse(res, 400, 'Title, author and ISBN are required.', 'VALIDATION_ERROR');
    }

    const book = await bookService.createBook({
      title,
      author,
      isbn,
      genre: genre || 'General',
      year: year || new Date().getFullYear(),
      totalCopies: totalCopies || 1,
      availableCopies,
      description: description || '',
      coverColor: coverColor || '#4A90D9',
      coverTextColor: coverTextColor || '#FFFFFF'
    });

    return successResponse(res, 201, 'Book added successfully.', book);
  } catch (err) {
    next(err);
  }
};

const updateBook = async (req, res, next) => {
  try {
    const book = await bookService.updateBook(req.params.id, req.body);
    return successResponse(res, 200, 'Book updated successfully.', book);
  } catch (err) {
    next(err);
  }
};

const deleteBook = async (req, res, next) => {
  try {
    await bookService.deleteBook(req.params.id);
    return successResponse(res, 200, 'Book deleted successfully.');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook
};
