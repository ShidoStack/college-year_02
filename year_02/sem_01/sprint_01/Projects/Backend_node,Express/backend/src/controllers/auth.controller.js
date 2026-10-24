const authService = require('../services/auth.service');
const { successResponse, errorResponse } = require('../utils/response');

const register = async (req, res, next) => {
  try {
    const { name, email, membershipId, password, contact, role } = req.body;

    if (!name || !email || !membershipId || !password) {
      return errorResponse(res, 400, 'Name, email, membershipId, and password are required.', 'VALIDATION_ERROR');
    }

    if (password.length < 6) {
      return errorResponse(res, 400, 'Password must be at least 6 characters.', 'VALIDATION_ERROR');
    }

    const session = await authService.register({
      name,
      email,
      membershipId,
      password,
      contact,
      role
    });

    return successResponse(res, 201, 'Account created successfully.', session);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 400, 'Email and password are required.', 'VALIDATION_ERROR');
    }

    const session = await authService.login(email, password);
    return successResponse(res, 200, 'Signed in successfully.', session);
  } catch (err) {
    next(err);
  }
};

const firebaseAuth = async (req, res, next) => {
  try {
    const { idToken, name, membershipId } = req.body;
    if (!idToken) {
      return errorResponse(res, 400, 'Firebase ID token is required.', 'VALIDATION_ERROR');
    }

    const session = await authService.firebaseAuth(idToken, { name, membershipId });
    return successResponse(res, 200, 'Firebase authentication successful.', session);
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res) => {
  const session = authService.formatSession(req.user);
  return successResponse(res, 200, 'Current profile retrieved.', session);
};

module.exports = {
  register,
  login,
  firebaseAuth,
  getMe
};
