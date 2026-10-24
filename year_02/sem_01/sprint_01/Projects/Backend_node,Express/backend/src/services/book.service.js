const Book = require('../models/Book');
const { getPagination } = require('../utils/pagination');

const getBooks = async (query = {}) => {
  const filter = {};

  if (query.search) {
    const s = query.search.trim();
    filter.$or = [
      { title: { $regex: s, $options: 'i' } },
      { author: { $regex: s, $options: 'i' } },
      { genre: { $regex: s, $options: 'i' } },
      { isbn: { $regex: s, $options: 'i' } }
    ];
  } else {
    if (query.title) filter.title = { $regex: query.title.trim(), $options: 'i' };
    if (query.author) filter.author = { $regex: query.author.trim(), $options: 'i' };
    if (query.genre) filter.genre = query.genre.trim();
    if (query.isbn) filter.isbn = { $regex: query.isbn.trim(), $options: 'i' };
  }

  if (query.available === 'available' || query.available === 'true') {
    filter.availableCopies = { $gt: 0 };
  } else if (query.available === 'borrowed' || query.available === 'unavailable') {
    filter.availableCopies = 0;
  }

  let sortOption = { title: 1 };
  if (query.sort) {
    switch (query.sort) {
      case 'title': sortOption = { title: 1 }; break;
      case 'author': sortOption = { author: 1 }; break;
      case 'genre': sortOption = { genre: 1 }; break;
      case 'year': sortOption = { year: -1 }; break;
      case 'newest': sortOption = { addedDate: -1, createdAt: -1 }; break;
    }
  }

  // If page/limit is provided, paginate, else return all (frontend handles large sets cleanly)
  if (query.page || query.limit) {
    const { page, limit, skip } = getPagination(query.page, query.limit);
    const [books, total] = await Promise.all([
      Book.find(filter).sort(sortOption).skip(skip).limit(limit),
      Book.countDocuments(filter)
    ]);
    return {
      books,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  const books = await Book.find(filter).sort(sortOption);
  return books;
};

const getBookById = async (id) => {
  const book = await Book.findById(id);
  if (!book) {
    const error = new Error('Book not found.');
    error.statusCode = 404;
    error.code = 'BOOK_NOT_FOUND';
    throw error;
  }
  return book;
};

const createBook = async (bookData) => {
  const existingIsbn = await Book.findOne({ isbn: bookData.isbn.trim() });
  if (existingIsbn) {
    const error = new Error('A book with this ISBN already exists.');
    error.statusCode = 409;
    error.code = 'ISBN_EXISTS';
    throw error;
  }

  if (bookData.availableCopies === undefined) {
    bookData.availableCopies = bookData.totalCopies || 1;
  }

  if (bookData.availableCopies > bookData.totalCopies) {
    const error = new Error('Available copies cannot exceed total copies.');
    error.statusCode = 400;
    error.code = 'INVALID_COPIES';
    throw error;
  }

  const book = await Book.create(bookData);
  return book;
};

const updateBook = async (id, updateData) => {
  const book = await getBookById(id);

  if (updateData.isbn && updateData.isbn !== book.isbn) {
    const existing = await Book.findOne({ isbn: updateData.isbn.trim(), _id: { $ne: id } });
    if (existing) {
      const error = new Error('A book with this ISBN already exists.');
      error.statusCode = 409;
      error.code = 'ISBN_EXISTS';
      throw error;
    }
  }

  const newTotal = updateData.totalCopies !== undefined ? updateData.totalCopies : book.totalCopies;
  const newAvail = updateData.availableCopies !== undefined ? updateData.availableCopies : book.availableCopies;

  if (newAvail > newTotal) {
    const error = new Error('Available copies cannot exceed total copies.');
    error.statusCode = 400;
    error.code = 'INVALID_COPIES';
    throw error;
  }

  Object.assign(book, updateData);
  await book.save();
  return book;
};

const deleteBook = async (id) => {
  const book = await getBookById(id);
  await Book.findByIdAndDelete(id);
  return book;
};

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};
