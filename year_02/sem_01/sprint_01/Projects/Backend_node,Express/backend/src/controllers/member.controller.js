const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/response');

// GET /api/members - Librarian only: get all members
const getMembers = async (req, res, next) => {
  try {
    const filter = { role: 'student' };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) {
      const s = req.query.search.trim();
      filter.$or = [
        { name: { $regex: s, $options: 'i' } },
        { email: { $regex: s, $options: 'i' } },
        { membershipId: { $regex: s, $options: 'i' } }
      ];
    }
    const members = await User.find(filter).sort({ name: 1 });
    return successResponse(res, 200, 'Members retrieved successfully.', members);
  } catch (err) {
    next(err);
  }
};

// GET /api/members/:id
const getMember = async (req, res, next) => {
  try {
    const member = await User.findById(req.params.id);
    if (!member) {
      return errorResponse(res, 404, 'Member not found.', 'MEMBER_NOT_FOUND');
    }
    return successResponse(res, 200, 'Member retrieved successfully.', member);
  } catch (err) {
    next(err);
  }
};

// POST /api/members - Librarian: add a member directly
const createMember = async (req, res, next) => {
  try {
    const { name, email, membershipId, contact, role, password } = req.body;

    if (!name || !email || !membershipId) {
      return errorResponse(res, 400, 'Name, email, and membershipId are required.', 'VALIDATION_ERROR');
    }

    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return errorResponse(res, 409, 'An account with this email already exists.', 'EMAIL_EXISTS');
    }

    const existingId = await User.findOne({ membershipId });
    if (existingId) {
      return errorResponse(res, 409, 'An account with this membership ID already exists.', 'MEMBERSHIP_ID_EXISTS');
    }

    const member = await User.create({
      name,
      email,
      membershipId,
      contact: contact || '',
      role: role || 'student',
      password: password || membershipId // default password = membershipId
    });

    return successResponse(res, 201, 'Member added successfully.', member);
  } catch (err) {
    next(err);
  }
};

// PUT /api/members/:id - Librarian: update member
const updateMember = async (req, res, next) => {
  try {
    const member = await User.findById(req.params.id);
    if (!member) {
      return errorResponse(res, 404, 'Member not found.', 'MEMBER_NOT_FOUND');
    }

    const allowed = ['name', 'contact', 'status', 'role'];
    allowed.forEach(field => {
      if (req.body[field] !== undefined) member[field] = req.body[field];
    });

    await member.save();
    return successResponse(res, 200, 'Member updated successfully.', member);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMembers,
  getMember,
  createMember,
  updateMember
};
