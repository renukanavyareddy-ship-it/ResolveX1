require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const { Server } = require('socket.io');

const { connectDB } = require('./config/db');
const autoSeedIfEmpty = require('./utils/seedHelper');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const userRoutes = require('./routes/userRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Store io instance on app for easy access in controllers
app.set('io', io);

// Socket.IO connection setup
io.on('connection', (socket) => {
  // Join a personal user room for targeted notifications
  socket.on('join:user', (userId) => {
    if (userId) {
      socket.join(`user_${userId}`);
    }
  });

  // Join admin room
  socket.on('join:admin', () => {
    socket.join('admins');
  });

  // Join specific complaint room for live timeline tracking
  socket.on('join:complaint', (complaintId) => {
    if (complaintId) {
      socket.join(`complaint_${complaintId}`);
    }
  });

  socket.on('disconnect', () => {
    // clean up automatically handled by socket.io
  });
});

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Static folder for file uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'ResolveX Smart Complaint Redressal API',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

// Start server after connecting to database
const startServer = async () => {
  try {
    await connectDB();
    await autoSeedIfEmpty();
    server.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`  ResolveX Backend API Server running on port ${PORT}`);
      console.log(`  Health Check: http://localhost:${PORT}/api/health`);
      console.log(`  Socket.IO: Enabled`);
      console.log(`====================================================`);
    });
  } catch (error) {
    console.error('Failed to start ResolveX server:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = { app, server };
