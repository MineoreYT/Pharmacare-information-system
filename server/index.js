const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./config/database');

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5174',
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// Import models with associations
require('./models/associations');

// Routes
app.use('/api/auth', require('./routes/authSQL'));
app.use('/api/drugs', require('./routes/drugsSQL'));
app.use('/api/inventory', require('./routes/inventorySQL'));
// Temporarily disable other routes until we convert them
// app.use('/api/prescriptions', require('./routes/prescriptions'));

app.get('/', (req, res) => {
  res.json({ message: 'Pharmacy Information System API' });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!', 
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth/register, /api/auth/login',
      drugs: '/api/drugs',
      inventory: '/api/inventory'
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:5174'}`);
});