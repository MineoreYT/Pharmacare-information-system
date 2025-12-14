const express = require('express');
const { body, validationResult } = require('express-validator');
const Inventory = require('../models/Inventory');
const Drug = require('../models/Drug');
const { auth, requirePermission } = require('../middleware/auth');

const router = express.Router();

// Get inventory with filters and pagination
router.get('/', auth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status = '', 
      lowStock = false,
      expiringSoon = false,
      drugId = ''
    } = req.query;

    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (drugId) {
      query.drug = drugId;
    }
    
    if (lowStock === 'true') {
      query.$expr = { $lte: ['$quantity', '$minimumStock'] };
    }
    
    if (expiringSoon === 'true') {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      query.expiryDate = { $lte: thirtyDaysFromNow };
    }

    const inventory = await Inventory.find(query)
      .populate('drug', 'name genericName dosageForm strength')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Inventory.countDocuments(query);

    res.json({
      inventory,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get inventory item by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id)
      .populate('drug');
    
    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Get inventory item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new inventory item
router.post('/', [
  auth,
  requirePermission('manage_inventory'),
  body('drug').notEmpty().withMessage('Drug ID is required'),
  body('batchNumber').trim().notEmpty().withMessage('Batch number is required'),
  body('quantity').isNumeric().withMessage('Quantity must be a number'),
  body('unitPrice').isNumeric().withMessage('Unit price must be a number'),
  body('expiryDate').isISO8601().withMessage('Valid expiry date is required'),
  body('manufacturingDate').isISO8601().withMessage('Valid manufacturing date is required'),
  body('supplier.name').trim().notEmpty().withMessage('Supplier name is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if drug exists
    const drug = await Drug.findById(req.body.drug);
    if (!drug) {
      return res.status(404).json({ message: 'Drug not found' });
    }

    // Check if batch already exists for this drug
    const existingBatch = await Inventory.findOne({
      drug: req.body.drug,
      batchNumber: req.body.batchNumber
    });

    if (existingBatch) {
      return res.status(400).json({ message: 'Batch number already exists for this drug' });
    }

    const inventoryItem = new Inventory(req.body);
    
    // Auto-set status based on conditions
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    if (inventoryItem.expiryDate <= now) {
      inventoryItem.status = 'expired';
    } else if (inventoryItem.quantity <= inventoryItem.minimumStock) {
      inventoryItem.status = 'low_stock';
    } else {
      inventoryItem.status = 'available';
    }

    await inventoryItem.save();
    await inventoryItem.populate('drug', 'name genericName dosageForm strength');

    res.status(201).json({
      message: 'Inventory item added successfully',
      item: inventoryItem
    });
  } catch (error) {
    console.error('Add inventory error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update inventory item
router.put('/:id', [
  auth,
  requirePermission('manage_inventory')
], async (req, res) => {
  try {
    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('drug', 'name genericName dosageForm strength');

    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    res.json({
      message: 'Inventory item updated successfully',
      item
    });
  } catch (error) {
    console.error('Update inventory error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update stock quantity (for dispensing)
router.patch('/:id/quantity', [
  auth,
  requirePermission('dispense_medication'),
  body('quantity').isNumeric().withMessage('Quantity must be a number'),
  body('operation').isIn(['add', 'subtract']).withMessage('Operation must be add or subtract')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { quantity, operation } = req.body;
    const item = await Inventory.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    if (operation === 'subtract') {
      if (item.quantity < quantity) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
      item.quantity -= quantity;
    } else {
      item.quantity += quantity;
    }

    // Update status based on new quantity
    if (item.quantity <= item.minimumStock) {
      item.status = 'low_stock';
    } else if (item.status === 'low_stock' && item.quantity > item.minimumStock) {
      item.status = 'available';
    }

    await item.save();
    await item.populate('drug', 'name genericName dosageForm strength');

    res.json({
      message: 'Stock quantity updated successfully',
      item
    });
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get low stock alerts
router.get('/alerts/low-stock', auth, async (req, res) => {
  try {
    const lowStockItems = await Inventory.find({
      $expr: { $lte: ['$quantity', '$minimumStock'] },
      status: { $ne: 'expired' }
    }).populate('drug', 'name genericName dosageForm strength');

    res.json(lowStockItems);
  } catch (error) {
    console.error('Get low stock alerts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get expiry alerts
router.get('/alerts/expiring', auth, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const alertDate = new Date();
    alertDate.setDate(alertDate.getDate() + parseInt(days));

    const expiringItems = await Inventory.find({
      expiryDate: { $lte: alertDate },
      status: { $ne: 'expired' }
    }).populate('drug', 'name genericName dosageForm strength')
      .sort({ expiryDate: 1 });

    res.json(expiringItems);
  } catch (error) {
    console.error('Get expiry alerts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;