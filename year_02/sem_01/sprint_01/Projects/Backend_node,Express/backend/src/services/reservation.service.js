const Reservation = require('../models/Reservation');
const Book = require('../models/Book');
const User = require('../models/User');

const createReservation = async ({ bookId, memberId }) => {
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

  const existing = await Reservation.findOne({
    bookId,
    memberId,
    status: { $in: ['waiting', 'ready'] }
  });

  if (existing) {
    const error = new Error('You already have an active reservation for this book.');
    error.statusCode = 409;
    error.code = 'DUPLICATE_RESERVATION';
    throw error;
  }

  const isAvailable = book.availableCopies > 0;
  const reservation = await Reservation.create({
    bookId,
    memberId,
    status: isAvailable ? 'ready' : 'waiting',
    available: isAvailable
  });

  return reservation;
};

const getReservations = async (filter = {}) => {
  return await Reservation.find(filter).sort({ reservedOn: -1 });
};

const cancelReservation = async (reservationId, memberId = null, isLibrarian = false) => {
  const reservation = await Reservation.findById(reservationId);
  if (!reservation) {
    const error = new Error('Reservation not found.');
    error.statusCode = 404;
    error.code = 'RESERVATION_NOT_FOUND';
    throw error;
  }

  if (!isLibrarian && memberId && reservation.memberId.toString() !== memberId.toString()) {
    const error = new Error('Unauthorized to cancel this reservation.');
    error.statusCode = 403;
    error.code = 'FORBIDDEN';
    throw error;
  }

  reservation.status = 'cancelled';
  await reservation.save();
  return reservation;
};

module.exports = {
  createReservation,
  getReservations,
  cancelReservation
};
