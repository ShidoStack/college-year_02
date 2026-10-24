const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');
const { errorResponse } = require('../utils/response');

const requireAuth = async (req, res, next) => {
  try {
    let token = null;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return errorResponse(res, 401, 'Authentication token required.', 'UNAUTHORIZED');
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);

    if (!user) {
      return errorResponse(res, 401, 'User no longer exists.', 'USER_NOT_FOUND');
    }

    if (user.status === 'suspended') {
      return errorResponse(res, 403, 'Your account has been suspended. Please contact the librarian.', 'ACCOUNT_SUSPENDED');
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return errorResponse(res, 401, 'Authentication token expired. Please sign in again.', 'TOKEN_EXPIRED');
    }
    return errorResponse(res, 401, 'Invalid authentication token.', 'INVALID_TOKEN');
  }
};

module.exports = {
  requireAuth
};
