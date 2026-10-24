const fineService = require('../services/fine.service');
const { successResponse, errorResponse } = require('../utils/response');

// GET /api/fines  — All fines for librarian, user's fines for student
const getAllFines = async (req, res, next) => {
  try {
    const isLibrarian = req.user.role === 'librarian' || req.user.role === 'admin';
    const fines = isLibrarian ? await fineService.getAllFines() : await fineService.getFinesByUser(req.user._id.toString());
    return successResponse(res, 200, 'Fines retrieved successfully.', fines);
  } catch (err) {
    next(err);
  }
};

// GET /api/fines/user/:id
const getFinesByUser = async (req, res, next) => {
  try {
    const fines = await fineService.getFinesByUser(req.params.id);
    return successResponse(res, 200, 'User fines retrieved successfully.', fines);
  } catch (err) {
    next(err);
  }
};

// POST /api/fines/calculate  — Recalculate overdue fines
const calculateFines = async (req, res, next) => {
  try {
    const result = await fineService.calculateFines(req.body.borrowingId || null);
    return successResponse(res, 200, 'Fines calculated successfully.', result);
  } catch (err) {
    next(err);
  }
};

// PUT /api/fines/:id/pay
const payFine = async (req, res, next) => {
  try {
    const fine = await fineService.payFine(req.params.id);
    return successResponse(res, 200, 'Fine marked as paid successfully.', fine);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllFines,
  getFinesByUser,
  calculateFines,
  payFine
};
