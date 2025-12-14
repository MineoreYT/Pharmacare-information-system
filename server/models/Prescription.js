const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  prescriptionNumber: {
    type: String,
    required: true
  },
  patient: {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    age: {
      type: Number,
      required: true
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true
    },
    phone: String,
    address: String,
    allergies: [String]
  },
  doctor: {
    name: {
      type: String,
      required: true
    },
    license: {
      type: String,
      required: true
    },
    specialty: String,
    hospital: String
  },
  medications: [{
    drug: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Drug',
      required: true
    },
    dosage: {
      type: String,
      required: true
    },
    frequency: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    instructions: String,
    substitutionAllowed: {
      type: Boolean,
      default: false
    }
  }],
  prescriptionDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'dispensed', 'partially_dispensed', 'cancelled'],
    default: 'pending'
  },
  dispensedBy: {
    pharmacistId: String,
    pharmacistName: String,
    dispensedDate: Date
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  insuranceInfo: {
    provider: String,
    policyNumber: String,
    copay: Number
  },
  notes: String
}, {
  timestamps: true
});

// Generate prescription number
prescriptionSchema.pre('save', async function(next) {
  if (!this.prescriptionNumber) {
    const count = await mongoose.model('Prescription').countDocuments();
    this.prescriptionNumber = `RX${Date.now()}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

prescriptionSchema.index({ prescriptionNumber: 1 }, { unique: true });
prescriptionSchema.index({ 'patient.id': 1 });
prescriptionSchema.index({ status: 1 });
prescriptionSchema.index({ prescriptionDate: -1 });

module.exports = mongoose.model('Prescription', prescriptionSchema);