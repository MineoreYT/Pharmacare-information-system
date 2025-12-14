import { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusIcon, MagnifyingGlassIcon, ExclamationTriangleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const InventoryManagement = () => {
  const { user } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    lowStock: false,
    expiringSoon: false
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  const [formData, setFormData] = useState({
    drug: '',
    batchNumber: '',
    quantity: '',
    unitPrice: '',
    expiryDate: '',
    manufacturingDate: '',
    supplier: {
      name: '',
      contact: '',
      email: ''
    },
    location: {
      shelf: '',
      section: '',
      room: ''
    },
    minimumStock: '10'
  });

  useEffect(() => {
    fetchInventory();
    fetchDrugs();
  }, [filters, pagination.currentPage]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: 10,
        ...filters
      };
      
      const response = await axios.get('/inventory', { params });
      setInventory(response.data.inventory);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        total: response.data.total
      });
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDrugs = async () => {
    try {
      const response = await axios.get('/drugs?limit=1000&isActive=true');
      setDrugs(response.data.drugs);
    } catch (error) {
      console.error('Failed to fetch drugs:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const inventoryData = {
        ...formData,
        quantity: parseInt(formData.quantity),
        unitPrice: parseFloat(formData.unitPrice),
        minimumStock: parseInt(formData.minimumStock)
      };

      await axios.post('/inventory', inventoryData);
      setShowModal(false);
      resetForm();
      fetchInventory();
    } catch (error) {
      console.error('Failed to add inventory:', error);
      alert('Failed to add inventory item');
    }
  };

  const resetForm = () => {
    setFormData({
      drug: '',
      batchNumber: '',
      quantity: '',
      unitPrice: '',
      expiryDate: '',
      manufacturingDate: '',
      supplier: {
        name: '',
        contact: '',
        email: ''
      },
      location: {
        shelf: '',
        section: '',
        room: ''
      },
      minimumStock: '10'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-300';
      case 'low_stock': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'expired': return 'bg-red-100 text-red-800 border-red-300';
      case 'recalled': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const isExpiringSoon = (expiryDate) => {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return new Date(expiryDate) <= thirtyDaysFromNow;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 shadow-xl relative overflow-hidden">
        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Inventory Management</h1>
              <p className="text-green-100 text-lg font-medium">Track stock levels, monitor expiry dates, and manage your pharmacy inventory</p>
              <div className="flex items-center space-x-6 mt-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-green-100 text-sm font-medium">{pagination.total} Total Items</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                  <span className="text-green-100 text-sm font-medium">Real-time Tracking</span>
                </div>
              </div>
            </div>
          </div>
          {user?.permissions?.includes('manage_inventory') && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border border-white/20"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Add Inventory</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-br from-white via-white to-emerald-50/20 rounded-2xl p-8 shadow-xl border border-emerald-200/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent"></div>
        <div className="relative grid grid-cols-1 md:grid-cols-5 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 tracking-wide uppercase">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="block w-full px-4 py-3 border border-gray-300/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="low_stock">Low Stock</option>
              <option value="expired">Expired</option>
              <option value="recalled">Recalled</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <label className="flex items-center space-x-3 cursor-pointer bg-white/60 backdrop-blur-sm px-4 py-3 rounded-xl border border-gray-200/50 hover:bg-white/80 transition-all duration-300">
              <input
                type="checkbox"
                checked={filters.lowStock}
                onChange={(e) => setFilters(prev => ({ ...prev, lowStock: e.target.checked }))}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-700 font-medium">Low Stock Only</span>
            </label>
          </div>
          
          <div className="flex items-center">
            <label className="flex items-center space-x-3 cursor-pointer bg-white/60 backdrop-blur-sm px-4 py-3 rounded-xl border border-gray-200/50 hover:bg-white/80 transition-all duration-300">
              <input
                type="checkbox"
                checked={filters.expiringSoon}
                onChange={(e) => setFilters(prev => ({ ...prev, expiringSoon: e.target.checked }))}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-700 font-medium">Expiring Soon</span>
            </label>
          </div>

          <div className="flex items-center">
            <div className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 px-6 py-3 rounded-xl text-sm font-bold border border-green-300/50 shadow-lg ring-1 ring-green-300/30">
              Total: {pagination.total} items
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="space-y-6">
        {loading ? (
          <div className="bg-white rounded-lg p-12 shadow-sm border border-gray-200 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-lg font-medium text-gray-700">Loading inventory...</p>
          </div>
        ) : inventory.length === 0 ? (
          <div className="bg-white rounded-lg p-12 shadow-sm border border-gray-200 text-center">
            <div className="p-4 bg-green-50 rounded-lg w-fit mx-auto mb-4">
              <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Inventory Items</h3>
            <p className="text-gray-600 mb-6">
              {user?.permissions?.includes('manage_inventory') 
                ? 'Start building your inventory by adding your first item.' 
                : 'No items available to display at the moment.'}
            </p>
            {user?.permissions?.includes('manage_inventory') && (
              <button
                onClick={() => setShowModal(true)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
              >
                <PlusIcon className="h-5 w-5 inline mr-2" />
                Add First Item
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inventory.map((item) => (
              <div key={item.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                {/* Item Header */}
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{item.drug?.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{item.drug?.genericName}</p>
                  <p className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full w-fit">
                    Batch: {item.batchNumber}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                      {item.status.replace('_', ' ')}
                    </span>
                    {item.quantity <= item.minimumStock && (
                      <span className="px-3 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full border border-red-200 flex items-center">
                        <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                        Low Stock
                      </span>
                    )}
                  </div>
                </div>

                {/* Item Details */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Stock:</span>
                    <span className="text-lg font-bold text-blue-600">{item.quantity} units</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Min Stock:</span>
                    <span className="text-sm text-gray-900">{item.minimumStock}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Expires:</span>
                    <span className={`text-sm ${isExpiringSoon(item.expiryDate) ? 'text-red-600 font-semibold flex items-center' : 'text-gray-900'}`}>
                      {new Date(item.expiryDate).toLocaleDateString()}
                      {isExpiringSoon(item.expiryDate) && <ClockIcon className="h-4 w-4 ml-1" />}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Location:</span>
                    <span className="text-sm text-gray-900">
                      {item.locationRoom && `${item.locationRoom}-`}
                      {item.locationSection && `${item.locationSection}-`}
                      {item.locationShelf || 'Not set'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span className="text-sm font-medium text-gray-700">Price:</span>
                    <span className="text-lg font-bold text-green-600">${item.unitPrice}</span>
                  </div>
                </div>

                {/* Supplier Info */}
                {item.supplierName && (
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Supplier:</span> {item.supplierName}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-sm font-medium text-gray-700">
            Page {pagination.currentPage} of {pagination.totalPages} ({pagination.total} total items)
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
              disabled={pagination.currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Previous
            </button>
            <button
              onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Add Inventory Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl max-h-[90vh] flex flex-col">
            {/* Modal Header - Fixed */}
            <div className="flex-shrink-0 bg-green-600 p-6 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-700 rounded-lg">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Add New Inventory Item
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="p-2 hover:bg-green-700 rounded-lg transition-colors duration-200"
                >
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
              {/* Modal Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Drug Selection Section */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    Drug Information
                  </h4>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Select Drug *</label>
                    <select
                      required
                      value={formData.drug}
                      onChange={(e) => setFormData(prev => ({ ...prev, drug: e.target.value }))}
                      className="block w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                    >
                      <option value="">Choose a drug from inventory...</option>
                      {drugs.map((drug) => (
                        <option key={drug.id} value={drug.id}>
                          {drug.name} ({drug.genericName}) - {drug.dosageForm} {drug.strength}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Batch & Quantity Section */}
                <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="h-5 w-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    Batch & Stock Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Batch Number *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., BATCH001"
                        value={formData.batchNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, batchNumber: e.target.value }))}
                        className="block w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        placeholder="100"
                        value={formData.quantity}
                        onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                        className="block w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Unit Price ($) *</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        min="0"
                        placeholder="10.50"
                        value={formData.unitPrice}
                        onChange={(e) => setFormData(prev => ({ ...prev, unitPrice: e.target.value }))}
                        className="block w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Dates Section */}
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="h-5 w-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Important Dates
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Manufacturing Date *</label>
                      <input
                        type="date"
                        required
                        value={formData.manufacturingDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, manufacturingDate: e.target.value }))}
                        className="block w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date *</label>
                      <input
                        type="date"
                        required
                        value={formData.expiryDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                        className="block w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Supplier & Stock Section */}
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="h-5 w-5 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Supplier & Stock Management
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Supplier Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., MedSupply Co."
                        value={formData.supplier.name}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          supplier: { ...prev.supplier, name: e.target.value }
                        }))}
                        className="block w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Stock Level</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="10"
                        value={formData.minimumStock}
                        onChange={(e) => setFormData(prev => ({ ...prev, minimumStock: e.target.value }))}
                        className="block w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Location Section */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="h-5 w-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Storage Location (Optional)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Room</label>
                      <input
                        type="text"
                        placeholder="A1"
                        value={formData.location.room}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          location: { ...prev.location, room: e.target.value }
                        }))}
                        className="block w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Section</label>
                      <input
                        type="text"
                        placeholder="B2"
                        value={formData.location.section}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          location: { ...prev.location, section: e.target.value }
                        }))}
                        className="block w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Shelf</label>
                      <input
                        type="text"
                        placeholder="C3"
                        value={formData.location.shelf}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          location: { ...prev.location, shelf: e.target.value }
                        }))}
                        className="block w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Modal Footer - Fixed */}
              <div className="flex-shrink-0 bg-gray-50 px-6 py-4 rounded-b-lg border-t border-gray-200">
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
                  >
                    Add to Inventory
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;