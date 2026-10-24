const { errorResponse } = require('../utils/response');

const notFoundHandler = (req, res, next) => {
  return errorResponse(res, 404, `Cannot find ${req.method} ${req.originalUrl}`, 'NOT_FOUND');
};

const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return errorResponse(res, 400, messages.join(', '), 'VALIDATION_ERROR');
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return errorResponse(res, 409, `An item with this ${field} already exists.`, 'DUPLICATE_KEY');
  }

  // Mongoose CastError (e.g. invalid ObjectId)
  if (err.name === 'CastError') {
    return errorResponse(res, 400, `Resource not found with id of ${err.value}`, 'CAST_ERROR');
  }

  // General server error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return errorResponse(res, statusCode, message, err.code || 'INTERNAL_ERROR');
};

module.exports = {
  notFoundHandler,
  errorHandler
};
