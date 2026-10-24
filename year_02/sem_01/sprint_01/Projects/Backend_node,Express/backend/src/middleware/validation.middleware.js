const mongoose = require('mongoose');
const { errorResponse } = require('../utils/response');

const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, 400, `Invalid ${paramName} parameter.`, 'INVALID_ID');
    }
    next();
  };
};

module.exports = {
  validateObjectId
};
