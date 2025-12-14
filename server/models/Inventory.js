const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  drug: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Drug',
    required: true
  },
  batchNumber: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  expiryDate: {
    type: Date,
    required: true
  },
  manufacturingDate: {
    type: Date,
    required: true
  },
  supplier: {
    name: {
      type: String,
      required: true
    },
    contact: String,
    email: String
  },
  location: {
    shelf: String,
    section: String,
    room: String
  },
  minimumStock: {
    type: Number,
    default: 10
  },
  status: {
    type: String,
    enum: ['available', 'low_stock', 'expired', 'recalled'],
    default: 'available'
  }
}, {
  timestamps: true
});


inventorySchema.index({ drug: 1, batchNumber: 1 }, { unique: true });
inventorySchema.index({ expiryDate: 1 });
inventorySchema.index({ status: 1 });

module.exports = mongoose.model('Inventory', inventorySchema);