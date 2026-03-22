const prisma = require('../config/database');

const createNotification = async ({ userId, title, message }) => {
  return await prisma.notification.create({
    data: {
      userId,
      title,
      message
    }
  });
};

const getUserNotifications = async (userId) => {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
};

const markAsRead = async (notificationId) => {
  return await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true }
  });
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead
};