const express = require('express');
const { body, validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');
const { Inventory, Drug } = require('../models/associations');
const { auth, requirePermission } = require('../middleware/authSQL');

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

    const where = {};
    
    if (status) {
      where.status = status;
    }
    
    if (drugId) {
      where.drugId = drugId;
    }
    
    if (lowStock === 'true') {
      where[Op.and] = [
        { quantity: { [Op.lte]: sequelize.col('minimumStock') } }
      ];
    }
    
    if (expiringSoon === 'true') {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      where.expiryDate = { [Op.lte]: thirtyDaysFromNow };
    }

    const offset = (page - 1) * limit;
    
    const { count, rows: inventory } = await Inventory.findAndCountAll({
      where,
      include: [{
        model: Drug,
        as: 'drug',
        attributes: ['id', 'name', 'genericName', 'dosageForm', 'strength']
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });

    res.json({
      inventory,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count
    });
  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get inventory item by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const item = await Inventory.findByPk(req.params.id, {
      include: [{
        model: Drug,
        as: 'drug'
      }]
    });
    
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
    const drug = await Drug.findByPk(req.body.drug);
    if (!drug) {
      return res.status(404).json({ message: 'Drug not found' });
    }

    // Check if batch already exists for this drug
    const existingBatch = await Inventory.findOne({
      where: {
        drugId: req.body.drug,
        batchNumber: req.body.batchNumber
      }
    });

    if (existingBatch) {
      return res.status(400).json({ message: 'Batch number already exists for this drug' });
    }

    // Prepare inventory data
    const inventoryData = {
      drugId: req.body.drug,
      batchNumber: req.body.batchNumber,
      quantity: parseInt(req.body.quantity),
      unitPrice: parseFloat(req.body.unitPrice),
      expiryDate: req.body.expiryDate,
      manufacturingDate: req.body.manufacturingDate,
      supplierName: req.body.supplier.name,
      supplierContact: req.body.supplier.contact,
      supplierEmail: req.body.supplier.email,
      locationRoom: req.body.location?.room,
      locationSection: req.body.location?.section,
      locationShelf: req.body.location?.shelf,
      minimumStock: parseInt(req.body.minimumStock) || 10
    };

    // Auto-set status based on conditions
    const now = new Date();
    
    if (new Date(inventoryData.expiryDate) <= now) {
      inventoryData.status = 'expired';
    } else if (inventoryData.quantity <= inventoryData.minimumStock) {
      inventoryData.status = 'low_stock';
    } else {
      inventoryData.status = 'available';
    }

    const inventoryItem = await Inventory.create(inventoryData);
    
    // Fetch the created item with drug details
    const itemWithDrug = await Inventory.findByPk(inventoryItem.id, {
      include: [{
        model: Drug,
        as: 'drug',
        attributes: ['id', 'name', 'genericName', 'dosageForm', 'strength']
      }]
    });

    res.status(201).json({
      message: 'Inventory item added successfully',
      item: itemWithDrug
    });
  } catch (error) {
    console.error('Add inventory error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get low stock alerts
router.get('/alerts/low-stock', auth, async (req, res) => {
  try {
    const lowStockItems = await Inventory.findAll({
      where: {
        [Op.and]: [
          { quantity: { [Op.lte]: sequelize.col('minimumStock') } },
          { status: { [Op.ne]: 'expired' } }
        ]
      },
      include: [{
        model: Drug,
        as: 'drug',
        attributes: ['id', 'name', 'genericName', 'dosageForm', 'strength']
      }]
    });

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

    const expiringItems = await Inventory.findAll({
      where: {
        expiryDate: { [Op.lte]: alertDate },
        status: { [Op.ne]: 'expired' }
      },
      include: [{
        model: Drug,
        as: 'drug',
        attributes: ['id', 'name', 'genericName', 'dosageForm', 'strength']
      }],
      order: [['expiryDate', 'ASC']]
    });

    res.json(expiringItems);
  } catch (error) {
    console.error('Get expiry alerts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;