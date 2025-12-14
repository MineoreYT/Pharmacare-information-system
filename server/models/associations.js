const Drug = require('./DrugSQL');
const Inventory = require('./InventorySQL');

// Set up asssociations
Drug.hasMany(Inventory, { foreignKey: 'drugId', as: 'inventory' });
Inventory.belongsTo(Drug, { foreignKey: 'drugId', as: 'drug' });

module.exports = {
  Drug,
  Inventory
};