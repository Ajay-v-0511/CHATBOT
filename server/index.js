const express = require('express');
const cors = require('cors');
const { connectDB, getDBState } = require('./config/db');
const config = require('./config/config');

const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Trust reverse proxies if any
app.set('trust proxy', 1);

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health / Status endpoint
app.get('/health', (req, res) => {
  const dbStatus = getDBState();
  res.json({
    status: 'ok',
    service: 'SmartAssist AI Backend',
    timestamp: new Date().toISOString(),
    database: dbStatus.isConnected ? 'MongoDB Connected' : (dbStatus.isFallbackMode ? 'Local Persistent Storage' : 'Initializing')
  });
});

// Mount Routes
app.use('/auth', authRoutes);
app.use('/api', chatRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// Global 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]', err);
  res.status(500).json({
    success: false,
    message: config.nodeEnv === 'production' ? 'Internal server error.' : err.message
  });
});

// Start Server & Connect to DB
const startServer = async () => {
  await connectDB();
  
  app.listen(config.port, () => {
    console.log(`🚀 SmartAssist AI Server running on port ${config.port}`);
    console.log(`🔗 API Base: http://localhost:${config.port}`);
  });
};

startServer();
