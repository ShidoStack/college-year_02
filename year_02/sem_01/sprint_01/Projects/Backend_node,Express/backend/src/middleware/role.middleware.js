const { errorResponse } = require('../utils/response');

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 401, 'Authentication required.', 'UNAUTHORIZED');
    }

    // Admins have access to librarian routes
    const userRole = req.user.role;
    const isAllowed = allowedRoles.includes(userRole) || (allowedRoles.includes('librarian') && userRole === 'admin');

    if (!isAllowed) {
      return errorResponse(res, 403, `Access denied. Requires one of: ${allowedRoles.join(', ')}`, 'FORBIDDEN');
    }

    next();
  };
};

module.exports = {
  requireRole
};
