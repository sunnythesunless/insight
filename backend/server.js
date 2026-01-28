const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

const helmet = require('helmet');
const cors = require('cors');

const { rateLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

const intelligenceRoutes = require('./routes/intelligenceRoutes');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');


const passport = require('passport');
require('./config/passport');
const logger = require('./utils/logger');



const app = express();

// Connect to database
connectDB();

// Init Background Jobs (Knowledge Decay)
const initCronJobs = require('./services/cronService');
initCronJobs();


// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.BASE_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-workspace-id'],
  credentials: true
}));
app.use(rateLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/workspaces', require('./routes/workspaceRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/activity', require('./routes/activityRoutes'));
app.use('/api/intelligence', intelligenceRoutes);
app.use(passport.initialize());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

// Error handler (must be last)
app.use(errorHandler);

const server = app.listen(process.env.PORT || 3000, () => {
  logger.info(`🚀 Server running on port ${process.env.PORT || 3000}`);
});

module.exports = app;
