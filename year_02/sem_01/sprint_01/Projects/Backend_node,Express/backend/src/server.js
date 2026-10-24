require('./config/env'); // Load env vars first
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const connectDB = require('./config/db');
const { PORT, NODE_ENV, CLIENT_URL } = require('./config/env');
const { initSocket } = require('./sockets/socket');
const { notFoundHandler, errorHandler } = require('./middleware/error.middleware');

// Routes
const authRoutes = require('./routes/auth.routes');
const bookRoutes = require('./routes/book.routes');
const memberRoutes = require('./routes/member.routes');
const borrowRoutes = require('./routes/borrow.routes');
const reservationRoutes = require('./routes/reservation.routes');
const fineRoutes = require('./routes/fine.routes');
const reportRoutes = require('./routes/report.routes');
const notificationRoutes = require('./routes/notification.routes');

const app = express();
const server = http.createServer(app);

// ---- Middleware ----
const corsOptions = {
  origin: CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

if (NODE_ENV !== 'test') {
  app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// ---- Health Check ----
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SmartLibrary API is running', timestamp: new Date().toISOString() });
});

// ---- API Routes ----
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/borrow', borrowRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/fines', fineRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);

// ---- Serve Built Frontend (Production / Unified Server) ----
const fs = require('fs');
const frontendDistPath = path.resolve(__dirname, '../../src/dist');

if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    const requestedFile = path.join(frontendDistPath, req.path);
    if (fs.existsSync(requestedFile) && fs.statSync(requestedFile).isFile()) {
      return res.sendFile(requestedFile);
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// ---- Error Handling ----
app.use(notFoundHandler);
app.use(errorHandler);

// ---- Socket.io ----
initSocket(server, corsOptions);

// ---- Start Server ----
const startServer = async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`\n🚀 SmartLibrary API server running on http://localhost:${PORT}`);
    console.log(`   Environment : ${NODE_ENV}`);
    console.log(`   Health Check: http://localhost:${PORT}/api/health`);
    console.log(`   CORS Origin : ${CLIENT_URL}\n`);
  });
};

startServer();
