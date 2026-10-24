const { Server } = require('socket.io');

let io = null;

const initSocket = (server, corsOptions) => {
  io = new Server(server, {
    cors: corsOptions || {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
  });

  io.on('connection', (socket) => {
    // Join user room for targeted notifications if memberId provided
    const memberId = socket.handshake.query.memberId;
    if (memberId) {
      socket.join(`member_${memberId}`);
    }

    socket.on('disconnect', () => {
      // client disconnected
    });
  });

  console.log('[SmartLibrary] Socket.io server initialized.');
  return io;
};

const getIO = () => {
  return io;
};

const emitBookBorrowed = (data) => {
  if (io) {
    io.emit('book:borrowed', data);
    io.emit('book:availability', { bookId: data.bookId, availableCopies: data.availableCopies });
  }
};

const emitBookReturned = (data) => {
  if (io) {
    io.emit('book:returned', data);
    io.emit('book:availability', { bookId: data.bookId, availableCopies: data.availableCopies });
  }
};

const emitReservationReady = (data) => {
  if (io) {
    io.emit('reservation:ready', data);
    if (data.memberId) {
      io.to(`member_${data.memberId}`).emit('reservation:ready', data);
    }
  }
};

const emitNotification = (memberId, notification) => {
  if (io) {
    io.emit('notification:new', { memberId, notification });
    if (memberId) {
      io.to(`member_${memberId}`).emit('notification:new', notification);
    }
  }
};

module.exports = {
  initSocket,
  getIO,
  emitBookBorrowed,
  emitBookReturned,
  emitReservationReady,
  emitNotification
};
