const dotenv = require('dotenv');
// Load env vars immediately
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5000;

const { initCronScheduler } = require('./services/cronService');

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  // Initialize cron job for appointment start email reminders
  initCronScheduler();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Unhandled Rejection Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
