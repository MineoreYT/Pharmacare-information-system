const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Drug = sequelize.define('Drug', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  genericName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  brandName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  dosageForm: {
    type: DataTypes.ENUM('tablet', 'capsule', 'syrup', 'injection', 'cream', 'drops', 'inhaler'),
    allowNull: false
  },
  strength: {
    type: DataTypes.STRING,
    allowNull: false
  },
  manufacturer: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('antibiotic', 'analgesic', 'antihypertensive', 'antidiabetic', 'vitamin', 'other'),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  sideEffects: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  contraindications: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  interactions: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  indexes: [
    {
      type: 'FULLTEXT',
      fields: ['name', 'genericName', 'brandName']
    }
  ]
});

module.exports = Drug;