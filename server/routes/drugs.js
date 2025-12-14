const express = require('express');
const { body, validationResult } = require('express-validator');
const Drug = require('../models/Drug');
const { auth, requirePermission } = require('../middleware/auth');

const router = express.Router();

// Get all drugs with search and pagination
router.get('/', auth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      category = '', 
      dosageForm = '',
      isActive = 'true'
    } = req.query;

    const query = {};
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (category) {
      query.category = category;
    }
    
    if (dosageForm) {
      query.dosageForm = dosageForm;
    }
    
    if (isActive !== 'all') {
      query.isActive = isActive === 'true';
    }

    const drugs = await Drug.find(query)
      .sort({ name: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Drug.countDocuments(query);

    res.json({
      drugs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get drugs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get drug by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const drug = await Drug.findById(req.params.id);
    
    if (!drug) {
      return res.status(404).json({ message: 'Drug not found' });
    }

    res.json(drug);
  } catch (error) {
    console.error('Get drug error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new drug
router.post('/', [
  auth,
  requirePermission('manage_inventory'),
  body('name').trim().notEmpty().withMessage('Drug name is required'),
  body('genericName').trim().notEmpty().withMessage('Generic name is required'),
  body('dosageForm').isIn(['tablet', 'capsule', 'syrup', 'injection', 'cream', 'drops', 'inhaler']).withMessage('Invalid dosage form'),
  body('strength').trim().notEmpty().withMessage('Strength is required'),
  body('manufacturer').trim().notEmpty().withMessage('Manufacturer is required'),
  body('category').isIn(['antibiotic', 'analgesic', 'antihypertensive', 'antidiabetic', 'vitamin', 'other']).withMessage('Invalid category'),
  body('price').isNumeric().withMessage('Price must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const drug = new Drug(req.body);
    await drug.save();

    res.status(201).json({
      message: 'Drug created successfully',
      drug
    });
  } catch (error) {
    console.error('Create drug error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update drug
router.put('/:id', [
  auth,
  requirePermission('manage_inventory')
], async (req, res) => {
  try {
    const drug = await Drug.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!drug) {
      return res.status(404).json({ message: 'Drug not found' });
    }

    res.json({
      message: 'Drug updated successfully',
      drug
    });
  } catch (error) {
    console.error('Update drug error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete drug (soft delete)
router.delete('/:id', [
  auth,
  requirePermission('manage_inventory')
], async (req, res) => {
  try {
    const drug = await Drug.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!drug) {
      return res.status(404).json({ message: 'Drug not found' });
    }

    res.json({ message: 'Drug deactivated successfully' });
  } catch (error) {
    console.error('Delete drug error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Check drug interactions
router.post('/check-interactions', auth, async (req, res) => {
  try {
    const { drugIds } = req.body;
    
    if (!Array.isArray(drugIds) || drugIds.length < 2) {
      return res.status(400).json({ message: 'At least 2 drugs required for interaction check' });
    }

    const drugs = await Drug.find({ _id: { $in: drugIds } });
    const interactions = [];

    for (let i = 0; i < drugs.length; i++) {
      for (let j = i + 1; j < drugs.length; j++) {
        const drug1 = drugs[i];
        const drug2 = drugs[j];
        
        // Check if drug1 has interactions with drug2
        const interaction = drug1.interactions.find(
          inter => inter.drugName.toLowerCase() === drug2.name.toLowerCase() ||
                   inter.drugName.toLowerCase() === drug2.genericName.toLowerCase()
        );
        
        if (interaction) {
          interactions.push({
            drug1: drug1.name,
            drug2: drug2.name,
            severity: interaction.severity,
            description: interaction.description
          });
        }
      }
    }

    res.json({ interactions });
  } catch (error) {
    console.error('Check interactions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;