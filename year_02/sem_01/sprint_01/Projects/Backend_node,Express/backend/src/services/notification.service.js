const Notification = require('../models/Notification');
const { emitNotification } = require('../sockets/socket');

const getNotifications = async (memberId = null) => {
  const filter = {};
  if (memberId) filter.memberId = memberId;
  return await Notification.find(filter).sort({ date: -1, createdAt: -1 });
};

const createNotification = async (data) => {
  const notif = await Notification.create(data);
  emitNotification(data.memberId.toString(), notif.toJSON());
  return notif;
};

const markAsRead = async (id, memberId = null) => {
  const filter = { _id: id };
  if (memberId) filter.memberId = memberId;
  const notif = await Notification.findOneAndUpdate(filter, { read: true }, { new: true });
  return notif;
};

const markAllAsRead = async (memberId) => {
  await Notification.updateMany({ memberId }, { read: true });
  return { success: true };
};

module.exports = {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead
};
