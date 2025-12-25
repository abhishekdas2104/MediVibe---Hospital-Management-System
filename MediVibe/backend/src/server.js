import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import connectDB from './config/database.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Import routes
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import nurseRoutes from './routes/nurseRoutes.js';
import receptionistRoutes from './routes/receptionistRoutes.js';
import bedRoutes from './routes/bedRoutes.js';
// import patientRoutes from './routes/patientRoutes.js';
// import wardRoutes from './routes/wardRoutes.js';
// import reportRoutes from './routes/reportRoutes.js';

// Import middleware
// import { errorHandler } from './middleware/errorHandler.js';
// import { requestLogger } from './middleware/logger.js';

const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO for real-time updates
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
  }
});

// ============================================
// MIDDLEWARE CONFIGURATION
// ============================================

// Security Middleware
app.use(helmet());

// CORS Configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Request Logging
app.use(morgan('dev'));

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ============================================
// ROUTES
// ============================================

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/nurse', nurseRoutes);
app.use('/api/receptionist', receptionistRoutes);
app.use('/api/beds', bedRoutes);
app.use('/api/patients', (req, res) => res.json({ message: 'Patient routes not implemented yet' }));
app.use('/api/wards', (req, res) => res.json({ message: 'Ward routes not implemented yet' }));
app.use('/api/reports', (req, res) => res.json({ message: 'Report routes not implemented yet' }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Root Endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'MediVibe - Hospital Management System API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      beds: '/api/beds',
      patients: '/api/patients',
      wards: '/api/wards',
      reports: '/api/reports'
    }
  });
});

// ============================================
// SOCKET.IO REAL-TIME HANDLING
// ============================================

io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);

  // Listen for bed updates
  socket.on('bed-update', (data) => {
    console.log('Bed update received:', data);
    // Broadcast to all connected clients
    io.emit('bed-status-changed', data);
  });

  // Listen for patient admission
  socket.on('patient-admitted', (data) => {
    console.log('Patient admitted:', data);
    io.emit('bed-occupied', data);
  });

  // Listen for patient discharge
  socket.on('patient-discharged', (data) => {
    console.log('Patient discharged:', data);
    io.emit('bed-released', data);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ============================================
// SERVER STARTUP
// ============================================

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║       MediVibe - Hospital Management      ║
║         Backend Server Started            ║
╠═══════════════════════════════════════════╣
║ Server: http://localhost:${PORT}
║ Environment: ${process.env.NODE_ENV || 'development'}
║ API Base: http://localhost:${PORT}/api
╚═══════════════════════════════════════════╝
  `);
});

// Handle Graceful Shutdown
process.on('SIGINT', () => {
  console.log('\n[Server] Shutting down gracefully...');
  httpServer.close(() => {
    console.log('[Server] Server closed');
    process.exit(0);
  });
});

export { app, io, httpServer };
