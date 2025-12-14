const mongoose = require('mongoose');

const drugSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  genericName: {
    type: String,
    required: true,
    trim: true
  },
  brandName: {
    type: String,
    trim: true
  },
  dosageForm: {
    type: String,
    required: true,
    enum: ['tablet', 'capsule', 'syrup', 'injection', 'cream', 'drops', 'inhaler']
  },
  strength: {
    type: String,
    required: true
  },
  manufacturer: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['antibiotic', 'analgesic', 'antihypertensive', 'antidiabetic', 'vitamin', 'other']
  },
  description: {
    type: String
  },
  sideEffects: [{
    type: String
  }],
  contraindications: [{
    type: String
  }],
  interactions: [{
    drugName: String,
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe']
    },
    description: String
  }],
  price: {
    type: Number,
    required: true,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster searches
drugSchema.index({ name: 'text', genericName: 'text', brandName: 'text' });

module.exports = mongoose.model('Drug', drugSchema);