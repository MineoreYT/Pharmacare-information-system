const express = require('express');
const { body, validationResult } = require('express-validator');
const Prescription = require('../models/Prescription');
const Drug = require('../models/Drug');
const Inventory = require('../models/Inventory');
const { auth, requirePermission } = require('../middleware/auth');

const router = express.Router();

// Get prescriptions with filters and pagination
router.get('/', auth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status = '', 
      patientId = '',
      prescriptionNumber = '',
      startDate = '',
      endDate = ''
    } = req.query;

    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (patientId) {
      query['patient.id'] = patientId;
    }
    
    if (prescriptionNumber) {
      query.prescriptionNumber = { $regex: prescriptionNumber, $options: 'i' };
    }
    
    if (startDate || endDate) {
      query.prescriptionDate = {};
      if (startDate) query.prescriptionDate.$gte = new Date(startDate);
      if (endDate) query.prescriptionDate.$lte = new Date(endDate);
    }

    const prescriptions = await Prescription.find(query)
      .populate('medications.drug', 'name genericName dosageForm strength')
      .sort({ prescriptionDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Prescription.countDocuments(query);

    res.json({
      prescriptions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get prescriptions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get prescription by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('medications.drug');
    
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.json(prescription);
  } catch (error) {
    console.error('Get prescription error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new prescription
router.post('/', [
  auth,
  body('patient.name').trim().notEmpty().withMessage('Patient name is required'),
  body('patient.age').isNumeric().withMessage('Patient age must be a number'),
  body('patient.gender').isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
  body('doctor.name').trim().notEmpty().withMessage('Doctor name is required'),
  body('doctor.license').trim().notEmpty().withMessage('Doctor license is required'),
  body('medications').isArray({ min: 1 }).withMessage('At least one medication is required'),
  body('prescriptionDate').isISO8601().withMessage('Valid prescription date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Validate all medications exist
    const medicationIds = req.body.medications.map(med => med.drug);
    const drugs = await Drug.find({ _id: { $in: medicationIds } });
    
    if (drugs.length !== medicationIds.length) {
      return res.status(400).json({ message: 'One or more medications not found' });
    }

    const prescription = new Prescription(req.body);
    
    // Calculate total amount
    let totalAmount = 0;
    for (const medication of prescription.medications) {
      const drug = drugs.find(d => d._id.toString() === medication.drug.toString());
      totalAmount += drug.price * medication.quantity;
    }
    prescription.totalAmount = totalAmount;

    await prescription.save();
    await prescription.populate('medications.drug', 'name genericName dosageForm strength price');

    res.status(201).json({
      message: 'Prescription created successfully',
      prescription
    });
  } catch (error) {
    console.error('Create prescription error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update prescription status
router.patch('/:id/status', [
  auth,
  body('status').isIn(['pending', 'verified', 'dispensed', 'partially_dispensed', 'cancelled']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const prescription = await Prescription.findByIdAndUpdate(
      req.params.id,
      { 
        status: req.body.status,
        ...(req.body.status === 'dispensed' && {
          'dispensedBy.pharmacistId': req.user.userId,
          'dispensedBy.pharmacistName': req.userProfile.profile.firstName + ' ' + req.userProfile.profile.lastName,
          'dispensedBy.dispensedDate': new Date()
        })
      },
      { new: true }
    ).populate('medications.drug', 'name genericName dosageForm strength');

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    res.json({
      message: 'Prescription status updated successfully',
      prescription
    });
  } catch (error) {
    console.error('Update prescription status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Dispense medication
router.post('/:id/dispense', [
  auth,
  requirePermission('dispense_medication'),
  body('medications').isArray({ min: 1 }).withMessage('Medications array is required'),
  body('medications.*.medicationId').notEmpty().withMessage('Medication ID is required'),
  body('medications.*.quantityDispensed').isNumeric().withMessage('Quantity dispensed must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const prescription = await Prescription.findById(req.params.id)
      .populate('medications.drug');

    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    if (prescription.status === 'dispensed') {
      return res.status(400).json({ message: 'Prescription already dispensed' });
    }

    const { medications: dispensingInfo } = req.body;
    const dispensingResults = [];

    for (const dispenseInfo of dispensingInfo) {
      const medication = prescription.medications.id(dispenseInfo.medicationId);
      
      if (!medication) {
        return res.status(400).json({ message: `Medication not found in prescription` });
      }

      // Find available inventory
      const availableInventory = await Inventory.find({
        drug: medication.drug._id,
        status: 'available',
        quantity: { $gte: dispenseInfo.quantityDispensed }
      }).sort({ expiryDate: 1 });

      if (availableInventory.length === 0) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${medication.drug.name}` 
        });
      }

      // Dispense from inventory (FIFO - First In, First Out)
      let remainingToDispense = dispenseInfo.quantityDispensed;
      const usedBatches = [];

      for (const inventoryItem of availableInventory) {
        if (remainingToDispense <= 0) break;

        const quantityFromThisBatch = Math.min(remainingToDispense, inventoryItem.quantity);
        
        inventoryItem.quantity -= quantityFromThisBatch;
        
        if (inventoryItem.quantity <= inventoryItem.minimumStock) {
          inventoryItem.status = 'low_stock';
        }
        
        await inventoryItem.save();
        
        usedBatches.push({
          batchNumber: inventoryItem.batchNumber,
          quantity: quantityFromThisBatch
        });
        
        remainingToDispense -= quantityFromThisBatch;
      }

      dispensingResults.push({
        medication: medication.drug.name,
        quantityDispensed: dispenseInfo.quantityDispensed,
        batches: usedBatches
      });
    }

    // Update prescription status
    const allMedicationsDispensed = prescription.medications.every(med => {
      const dispenseInfo = dispensingInfo.find(d => d.medicationId === med._id.toString());
      return dispenseInfo && dispenseInfo.quantityDispensed >= med.quantity;
    });

    prescription.status = allMedicationsDispensed ? 'dispensed' : 'partially_dispensed';
    prescription.dispensedBy = {
      pharmacistId: req.user.userId,
      pharmacistName: req.userProfile.profile.firstName + ' ' + req.userProfile.profile.lastName,
      dispensedDate: new Date()
    };

    await prescription.save();

    res.json({
      message: 'Medication dispensed successfully',
      prescription,
      dispensingResults
    });
  } catch (error) {
    console.error('Dispense medication error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get patient medication history
router.get('/patient/:patientId/history', auth, async (req, res) => {
  try {
    const { patientId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const prescriptions = await Prescription.find({ 'patient.id': patientId })
      .populate('medications.drug', 'name genericName dosageForm strength')
      .sort({ prescriptionDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Prescription.countDocuments({ 'patient.id': patientId });

    res.json({
      prescriptions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get patient history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;