const reportService = require('../services/report.service');
const { successResponse } = require('../utils/response');

// GET /api/reports/borrowing
const getBorrowingReport = async (req, res, next) => {
  try {
    const data = await reportService.getBorrowingReport();
    return successResponse(res, 200, 'Borrowing report retrieved successfully.', data);
  } catch (err) {
    next(err);
  }
};

// GET /api/reports/popular-books
const getPopularBooksReport = async (req, res, next) => {
  try {
    const data = await reportService.getPopularBooksReport();
    return successResponse(res, 200, 'Popular books report retrieved successfully.', data);
  } catch (err) {
    next(err);
  }
};

// GET /api/reports/member-activity
const getMemberActivityReport = async (req, res, next) => {
  try {
    const data = await reportService.getMemberActivityReport();
    return successResponse(res, 200, 'Member activity report retrieved successfully.', data);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getBorrowingReport,
  getPopularBooksReport,
  getMemberActivityReport
};
