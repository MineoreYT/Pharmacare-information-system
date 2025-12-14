const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Inventory = sequelize.define('Inventory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  drugId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Drugs',
      key: 'id'
    }
  },
  batchNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  manufacturingDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  supplierName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  supplierContact: {
    type: DataTypes.STRING,
    allowNull: true
  },
  supplierEmail: {
    type: DataTypes.STRING,
    allowNull: true
  },
  locationRoom: {
    type: DataTypes.STRING,
    allowNull: true
  },
  locationSection: {
    type: DataTypes.STRING,
    allowNull: true
  },
  locationShelf: {
    type: DataTypes.STRING,
    allowNull: true
  },
  minimumStock: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  status: {
    type: DataTypes.ENUM('available', 'low_stock', 'expired', 'recalled'),
    defaultValue: 'available'
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['drugId', 'batchNumber']
    },
    {
      fields: ['expiryDate']
    },
    {
      fields: ['status']
    }
  ]
});

module.exports = Inventory;