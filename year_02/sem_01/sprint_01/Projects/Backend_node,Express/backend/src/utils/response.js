/**
 * Standard API Response Utilities
 */

const successResponse = (res, statusCode = 200, message = 'Success', data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const errorResponse = (res, statusCode = 500, message = 'An error occurred', error = null) => {
  const payload = {
    success: false,
    message
  };

  if (error) {
    payload.error = typeof error === 'string' ? error : (error.code || error.name || 'SERVER_ERROR');
  }

  return res.status(statusCode).json(payload);
};

module.exports = {
  successResponse,
  errorResponse
};
