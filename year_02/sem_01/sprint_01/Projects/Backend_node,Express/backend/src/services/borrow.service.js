const BorrowRecord = require('../models/BorrowRecord');
const Book = require('../models/Book');
const User = require('../models/User');
const Fine = require('../models/Fine');
const Reservation = require('../models/Reservation');
const Notification = require('../models/Notification');
const { BORROW_DURATION_DAYS, FINE_PER_DAY } = require('../config/env');
const { emitBookBorrowed, emitBookReturned, emitReservationReady, emitNotification } = require('../sockets/socket');

const borrowBook = async ({ bookId, memberId }) => {
  const [book, member] = await Promise.all([
    Book.findById(bookId),
    User.findById(memberId)
  ]);

  if (!book) {
    const error = new Error('Book not found.');
    error.statusCode = 404;
    error.code = 'BOOK_NOT_FOUND';
    throw error;
  }

  if (!member) {
    const error = new Error('Member not found.');
    error.statusCode = 404;
    error.code = 'MEMBER_NOT_FOUND';
    throw error;
  }

  if (member.status === 'suspended') {
    const error = new Error('Suspended members cannot borrow books.');
    error.statusCode = 403;
    error.code = 'MEMBER_SUSPENDED';
    throw error;
  }

  if (book.availableCopies <= 0) {
    const error = new Error('No copies available for borrowing. You can reserve this book.');
    error.statusCode = 400;
    error.code = 'BOOK_UNAVAILABLE';
    throw error;
  }

  // Prevent duplicate active borrowing of the same book
  const activeBorrow = await BorrowRecord.findOne({
    bookId,
    memberId,
    status: { $in: ['borrowed', 'overdue'] }
  });

  if (activeBorrow) {
    const error = new Error('You have already borrowed this book.');
    error.statusCode = 409;
    error.code = 'DUPLICATE_BORROW';
    throw error;
  }

  const issueDate = new Date();
  const dueDate = new Date(issueDate);
  dueDate.setDate(dueDate.getDate() + BORROW_DURATION_DAYS);

  const record = await BorrowRecord.create({
    bookId,
    memberId,
    issueDate,
    dueDate,
    status: 'borrowed'
  });

  // Decrement copy
  book.availableCopies = Math.max(0, book.availableCopies - 1);
  await book.save();

  // Update member count
  const activeCount = await BorrowRecord.countDocuments({
    memberId,
    status: { $in: ['borrowed', 'overdue'] }
  });
  member.booksBorrowed = activeCount;
  await member.save();

  // Create notification
  const notif = await Notification.create({
    memberId,
    type: 'success',
    title: 'Book Borrowed',
    message: `You have borrowed "${book.title}". Due date: ${dueDate.toISOString().split('T')[0]}.`
  });

  // Real-time Socket.io emission
  emitBookBorrowed({
    bookId: book._id.toString(),
    availableCopies: book.availableCopies,
    bookTitle: book.title,
    memberId: member._id.toString()
  });
  emitNotification(member._id.toString(), notif.toJSON());

  return record;
};

const returnBook = async (borrowingId) => {
  const record = await BorrowRecord.findById(borrowingId);
  if (!record) {
    const error = new Error('Borrow record not found.');
    error.statusCode = 404;
    error.code = 'BORROW_NOT_FOUND';
    throw error;
  }

  if (record.status === 'returned') {
    const error = new Error('Book has already been returned.');
    error.statusCode = 400;
    error.code = 'ALREADY_RETURNED';
    throw error;
  }

  const [book, member] = await Promise.all([
    Book.findById(record.bookId),
    User.findById(record.memberId)
  ]);

  const returnDate = new Date();
  record.returnDate = returnDate;
  record.status = 'returned';

  // Calculate overdue fine if applicable
  const due = new Date(record.dueDate);
  const diffDays = Math.floor((returnDate - due) / (1000 * 60 * 60 * 24));
  let calculatedFine = 0;

  if (diffDays > 0) {
    calculatedFine = diffDays * FINE_PER_DAY;
    record.fine = calculatedFine;

    // Create or update Fine record
    await Fine.create({
      memberId: record.memberId,
      bookId: record.bookId,
      borrowRecordId: record._id,
      dueDate: record.dueDate,
      daysOverdue: diffDays,
      amount: calculatedFine,
      reason: `Returned ${diffDays} day(s) overdue`,
      status: 'unpaid'
    });

    if (member) {
      member.outstandingFine = (member.outstandingFine || 0) + calculatedFine;
      await member.save();
    }
  }

  await record.save();

  // Restore available copies (cannot exceed totalCopies)
  if (book) {
    book.availableCopies = Math.min(book.totalCopies, book.availableCopies + 1);
    await book.save();
  }

  // Update member active borrow count
  if (member) {
    const activeCount = await BorrowRecord.countDocuments({
      memberId: member._id,
      status: { $in: ['borrowed', 'overdue'] }
    });
    member.booksBorrowed = activeCount;
    await member.save();
  }

  // Check if any reservation is waiting for this book
  const pendingReservation = await Reservation.findOne({
    bookId: record.bookId,
    status: 'waiting'
  }).sort({ reservedOn: 1 });

  if (pendingReservation) {
    pendingReservation.status = 'ready';
    pendingReservation.available = true;
    await pendingReservation.save();

    const reservedNotif = await Notification.create({
      memberId: pendingReservation.memberId,
      type: 'reservation_ready',
      title: 'Reserved Book Available',
      message: `"${book ? book.title : 'Reserved book'}" is now available for pickup.`
    });

    emitReservationReady({
      reservationId: pendingReservation._id.toString(),
      bookId: record.bookId.toString(),
      bookTitle: book ? book.title : '',
      memberId: pendingReservation.memberId.toString()
    });
    emitNotification(pendingReservation.memberId.toString(), reservedNotif.toJSON());
  }

  // Return notification
  if (member) {
    const retNotif = await Notification.create({
      memberId: member._id,
      type: 'success',
      title: 'Book Returned',
      message: `"${book ? book.title : 'Book'}" was returned successfully.${calculatedFine > 0 ? ` Overdue fine: $${calculatedFine}.` : ''}`
    });
    emitNotification(member._id.toString(), retNotif.toJSON());
  }

  // Emit real-time book return event
  emitBookReturned({
    bookId: book ? book._id.toString() : record.bookId.toString(),
    availableCopies: book ? book.availableCopies : 0,
    bookTitle: book ? book.title : '',
    memberId: record.memberId.toString()
  });

  return record;
};

const getBorrowings = async (query = {}) => {
  const filter = {};
  if (query.status) {
    filter.status = query.status;
  }
  if (query.memberId) {
    filter.memberId = query.memberId;
  }

  return await BorrowRecord.find(filter).sort({ issueDate: -1 });
};

const getBorrowingsByUser = async (memberId) => {
  return await BorrowRecord.find({ memberId }).sort({ issueDate: -1 });
};

module.exports = {
  borrowBook,
  returnBook,
  getBorrowings,
  getBorrowingsByUser
};
