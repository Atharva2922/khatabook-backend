// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
// ... (comments omitted for brevity)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/khatabook_db';

console.log('Connecting to MongoDB...');
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    console.log(`   Database: ${MONGODB_URI.includes('mongodb+srv') ? 'MongoDB Atlas (Cloud)' : 'Local MongoDB'}`);
  })
  .catch(err => {
    console.log('❌ MongoDB Connection Error:', err.message);
    console.log('   Tip: For cloud access, use MongoDB Atlas - see mongodb_atlas_setup.md');
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

app.get('/', (req, res) => {
  res.send('Khatabook Backend is running');
});

// Test endpoint for connectivity
app.get('/api/test', (req, res) => {
  res.json({
    message: 'Connection successful!',
    timestamp: new Date().toISOString()
  });
});

// Listen on all network interfaces to allow connections from devices on local network
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`Access from your device at: http://192.168.0.102:${PORT}`);
});
