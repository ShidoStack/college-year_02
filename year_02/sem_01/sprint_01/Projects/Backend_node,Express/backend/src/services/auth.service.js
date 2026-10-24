const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { verifyFirebaseToken } = require('../config/firebase');

const formatSession = (user) => {
  const token = generateToken({
    id: user._id.toString(),
    email: user.email,
    role: user.role
  });

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    membershipId: user.membershipId,
    token
  };
};

const register = async ({ name, email, membershipId, password, contact, role = 'student' }) => {
  const existingEmail = await User.findOne({ email: email.toLowerCase() });
  if (existingEmail) {
    const error = new Error('An account with this email already exists.');
    error.statusCode = 409;
    error.code = 'EMAIL_EXISTS';
    throw error;
  }

  const existingMemberId = await User.findOne({ membershipId });
  if (existingMemberId) {
    const error = new Error('An account with this membership ID already exists.');
    error.statusCode = 409;
    error.code = 'MEMBERSHIP_ID_EXISTS';
    throw error;
  }

  const user = await User.create({
    name,
    email,
    membershipId,
    password,
    contact: contact || '',
    role
  });

  return formatSession(user);
};

const login = async (email, password) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  if (user.status === 'suspended') {
    const error = new Error('Your account has been suspended. Please contact the library administrator.');
    error.statusCode = 403;
    error.code = 'ACCOUNT_SUSPENDED';
    throw error;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  return formatSession(user);
};

const firebaseAuth = async (idToken, { name: customName, membershipId: customMembershipId } = {}) => {
  const decoded = await verifyFirebaseToken(idToken);

  let user = await User.findOne({
    $or: [
      { firebaseUid: decoded.uid },
      { email: decoded.email.toLowerCase() }
    ]
  });

  if (!user) {
    // Auto-create user for new Firebase account
    const count = await User.countDocuments();
    const autoMemberId = customMembershipId || ('STU' + new Date().getFullYear() + String(count + 1).padStart(3, '0'));
    const displayName = customName || decoded.name || decoded.email.split('@')[0];

    // Check if that membershipId already exists
    if (customMembershipId) {
      const existingMember = await User.findOne({ membershipId: customMembershipId });
      if (existingMember) {
        const error = new Error('An account with this membership ID already exists.');
        error.statusCode = 409;
        error.code = 'MEMBERSHIP_ID_EXISTS';
        throw error;
      }
    }

    user = await User.create({
      name: displayName,
      email: decoded.email.toLowerCase(),
      firebaseUid: decoded.uid,
      membershipId: autoMemberId,
      role: 'student'
    });
  } else {
    // Existing user — link Firebase UID if not yet linked
    if (!user.firebaseUid) {
      user.firebaseUid = decoded.uid;
      await user.save();
    }
  }

  return formatSession(user);
};

module.exports = {
  register,
  login,
  firebaseAuth,
  formatSession
};
