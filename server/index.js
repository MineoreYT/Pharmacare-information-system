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

// Create test user endpoint for debugging
app.post('/api/create-test-user', async (req, res) => {
  try {
    const User = require('./models/UserSQL');
    
    // Check if admin user exists
    const existingAdmin = await User.findOne({ where: { username: 'admin' } });
    
    if (existingAdmin) {
      return res.json({ 
        message: 'Admin user already exists!',
        credentials: { username: 'admin', password: 'admin123' }
      });
    }
    
    // Create admin user
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@pharmacy.com',
      password: 'admin123',
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      permissions: ['view_inventory', 'manage_inventory', 'dispense_medication', 'view_prescriptions', 'manage_users', 'generate_reports']
    });
    
    res.json({
      message: 'Test admin user created successfully!',
      credentials: { username: 'admin', password: 'admin123' },
      user: {
        id: adminUser.id,
        username: adminUser.username,
        role: adminUser.role
      }
    });
  } catch (error) {
    console.error('Error creating test user:', error);
    res.status(500).json({ 
      message: 'Error creating test user',
      error: error.message 
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:5174'}`);
});