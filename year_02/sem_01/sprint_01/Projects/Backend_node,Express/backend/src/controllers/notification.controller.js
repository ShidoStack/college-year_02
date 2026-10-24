const notificationService = require('../services/notification.service');
const { successResponse } = require('../utils/response');

// GET /api/notifications  — Get notifications for the logged-in user (or all for librarian)
const getNotifications = async (req, res, next) => {
  try {
    const isLibrarian = req.user.role === 'librarian' || req.user.role === 'admin';
    const memberId = isLibrarian ? (req.query.memberId || null) : req.user._id.toString();
    const notifications = await notificationService.getNotifications(memberId);
    return successResponse(res, 200, 'Notifications retrieved successfully.', notifications);
  } catch (err) {
    next(err);
  }
};

// POST /api/notifications  — Create a manual notification (librarian)
const createNotification = async (req, res, next) => {
  try {
    const { memberId, type, title, message } = req.body;
    const notif = await notificationService.createNotification({ memberId, type, title, message });
    return successResponse(res, 201, 'Notification created.', notif);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/notifications/:id/read
const markAsRead = async (req, res, next) => {
  try {
    const isLibrarian = req.user.role === 'librarian' || req.user.role === 'admin';
    const memberId = isLibrarian ? null : req.user._id.toString();
    const notif = await notificationService.markAsRead(req.params.id, memberId);
    return successResponse(res, 200, 'Notification marked as read.', notif);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/notifications/read-all
const markAllAsRead = async (req, res, next) => {
  try {
    const memberId = req.user._id.toString();
    await notificationService.markAllAsRead(memberId);
    return successResponse(res, 200, 'All notifications marked as read.');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead
};
