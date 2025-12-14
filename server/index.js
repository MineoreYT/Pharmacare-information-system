const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./config/database');

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});