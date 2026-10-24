const reservationService = require('../services/reservation.service');
const { successResponse, errorResponse } = require('../utils/response');

// POST /api/reservations
const createReservation = async (req, res, next) => {
  try {
    const { bookId, memberId } = req.body;
    if (!bookId || !memberId) {
      return errorResponse(res, 400, 'bookId and memberId are required.', 'VALIDATION_ERROR');
    }
    const reservation = await reservationService.createReservation({ bookId, memberId });
    return successResponse(res, 201, 'Book reserved successfully.', reservation);
  } catch (err) {
    next(err);
  }
};

// GET /api/reservations  — optional ?memberId=&status=
const getReservations = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.memberId) filter.memberId = req.query.memberId;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.bookId) filter.bookId = req.query.bookId;

    const reservations = await reservationService.getReservations(filter);
    return successResponse(res, 200, 'Reservations retrieved successfully.', reservations);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/reservations/:id
const cancelReservation = async (req, res, next) => {
  try {
    const isLibrarian = req.user && (req.user.role === 'librarian' || req.user.role === 'admin');
    const memberId = isLibrarian ? null : req.user._id;
    const reservation = await reservationService.cancelReservation(req.params.id, memberId, isLibrarian);
    return successResponse(res, 200, 'Reservation cancelled successfully.', reservation);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createReservation,
  getReservations,
  cancelReservation
};
