import { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const DrugManagement = () => {
  const { user } = useAuth();
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDrug, setEditingDrug] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    dosageForm: '',
    isActive: 'true'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    brandName: '',
    dosageForm: 'tablet',
    strength: '',
    manufacturer: '',
    category: 'other',
    description: '',
    price: '',
    sideEffects: [],
    contraindications: [],
    interactions: []
  });

  useEffect(() => {
    fetchDrugs();
  }, [searchTerm, filters, pagination.currentPage]);

  const fetchDrugs = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: 10,
        search: searchTerm,
        ...filters
      };
      
      const response = await axios.get('/drugs', { params });
      setDrugs(response.data.drugs);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        total: response.data.total
      });
    } catch (error) {
      console.error('Failed to fetch drugs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const drugData = {
        ...formData,
        price: parseFloat(formData.price),
        sideEffects: formData.sideEffects.filter(effect => effect.trim()),
        contraindications: formData.contraindications.filter(contra => contra.trim())
      };

      if (editingDrug) {
        await axios.put(`/drugs/${editingDrug.id}`, drugData);
      } else {
        await axios.post('/drugs', drugData);
      }
      
      setShowModal(false);
      setEditingDrug(null);
      resetForm();
      fetchDrugs();
    } catch (error) {
      console.error('Failed to save drug:', error);
    }
  };

  const handleEdit = (drug) => {
    setEditingDrug(drug);
    setFormData({
      ...drug,
      price: drug.price.toString(),
      sideEffects: drug.sideEffects || [],
      contraindications: drug.contraindications || []
    });
    setShowModal(true);
  };

  const handleDelete = async (drugId) => {
    if (window.confirm('Are you sure you want to deactivate this drug?')) {
      try {
        await axios.delete(`/drugs/${drugId}`);
        fetchDrugs();
      } catch (error) {
        console.error('Failed to delete drug:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      genericName: '',
      brandName: '',
      dosageForm: 'tablet',
      strength: '',
      manufacturer: '',
      category: 'other',
      description: '',
      price: '',
      sideEffects: [],
      contraindications: [],
      interactions: []
    });
  };

  const addArrayField = (field, value) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
    }
  };

  const removeArrayField = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const getCategoryColor = (category) => {
    const colors = {
      antibiotic: 'bg-red-100 text-red-800',
      analgesic: 'bg-blue-100 text-blue-800',
      antihypertensive: 'bg-purple-100 text-purple-800',
      antidiabetic: 'bg-green-100 text-green-800',
      vitamin: 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.other;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 shadow-xl relative overflow-hidden">
        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Drug Management</h1>
              <p className="text-blue-100 text-lg font-medium">Manage your comprehensive drug database with advanced search and categorization</p>
              <div className="flex items-center space-x-6 mt-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-blue-100 text-sm font-medium">{pagination.total} Total Drugs</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                  <span className="text-blue-100 text-sm font-medium">Real-time Updates</span>
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
              <span>Add New Drug</span>
            </button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-gradient-to-br from-white via-white to-green-50/20 rounded-2xl p-8 shadow-xl border border-green-200/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent"></div>
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 tracking-wide uppercase">Search Drugs</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by drug name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-12 pr-4 py-3 border border-gray-300/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 tracking-wide uppercase">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="block w-full px-4 py-3 border border-gray-300/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <option value="">All Categories</option>
              <option value="antibiotic">Antibiotic</option>
              <option value="analgesic">Analgesic</option>
              <option value="antihypertensive">Antihypertensive</option>
              <option value="antidiabetic">Antidiabetic</option>
              <option value="vitamin">Vitamin</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 tracking-wide uppercase">Dosage Form</label>
            <select
              value={filters.dosageForm}
              onChange={(e) => setFilters(prev => ({ ...prev, dosageForm: e.target.value }))}
              className="block w-full px-4 py-3 border border-gray-300/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <option value="">All Forms</option>
              <option value="tablet">Tablet</option>
              <option value="capsule">Capsule</option>
              <option value="syrup">Syrup</option>
              <option value="injection">Injection</option>
              <option value="cream">Cream</option>
              <option value="drops">Drops</option>
              <option value="inhaler">Inhaler</option>
            </select>
          </div>
          <div className="flex items-end">
            <div className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 px-6 py-3 rounded-xl text-sm font-bold border border-green-300/50 shadow-lg ring-1 ring-green-300/30">
              Total: {pagination.total} drugs
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        ) : drugs.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No drugs found</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first drug to the database.</p>
            {user?.permissions?.includes('manage_inventory') && (
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add First Drug
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Drug</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Form & Strength</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manufacturer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  {user?.permissions?.includes('manage_inventory') && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {drugs.map((drug) => (
                  <tr key={drug.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-gray-600">
                            {drug.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{drug.name}</div>
                          <div className="text-sm text-gray-500">{drug.genericName}</div>
                          {drug.brandName && (
                            <div className="text-xs text-blue-600">Brand: {drug.brandName}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${getCategoryColor(drug.category)}`}>
                        {drug.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                      {drug.dosageForm} - {drug.strength}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {drug.manufacturer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      ${drug.price}
                    </td>
                    {user?.permissions?.includes('manage_inventory') && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(drug)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit Drug"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(drug.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Drug"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((pagination.currentPage - 1) * 10) + 1} to {Math.min(pagination.currentPage * 10, pagination.total)} of {pagination.total} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                disabled={pagination.currentPage === 1}
                className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPagination(prev => ({ ...prev, currentPage: pageNum }))}
                      className={`px-3 py-1 text-sm rounded-lg ${
                        pagination.currentPage === pageNum
                          ? 'bg-green-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-3 py-1 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex-shrink-0 p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingDrug ? 'Edit Drug' : 'Add New Drug'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingDrug(null);
                    resetForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
              {/* Modal Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Basic Information */}
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Basic Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Drug Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter drug name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Generic Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.genericName}
                        onChange={(e) => setFormData(prev => ({ ...prev, genericName: e.target.value }))}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter generic name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name</label>
                      <input
                        type="text"
                        value={formData.brandName}
                        onChange={(e) => setFormData(prev => ({ ...prev, brandName: e.target.value }))}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter brand name (optional)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Manufacturer *</label>
                      <input
                        type="text"
                        required
                        value={formData.manufacturer}
                        onChange={(e) => setFormData(prev => ({ ...prev, manufacturer: e.target.value }))}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter manufacturer name"
                      />
                    </div>
                  </div>
                </div>

                {/* Formulation Details */}
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="h-5 w-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Formulation Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Dosage Form *</label>
                      <select
                        value={formData.dosageForm}
                        onChange={(e) => setFormData(prev => ({ ...prev, dosageForm: e.target.value }))}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="tablet">💊 Tablet</option>
                        <option value="capsule">🔴 Capsule</option>
                        <option value="syrup">🥤 Syrup</option>
                        <option value="injection">💉 Injection</option>
                        <option value="cream">🧴 Cream</option>
                        <option value="drops">💧 Drops</option>
                        <option value="inhaler">🌬️ Inhaler</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Strength *</label>
                      <input
                        type="text"
                        required
                        value={formData.strength}
                        onChange={(e) => setFormData(prev => ({ ...prev, strength: e.target.value }))}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="e.g., 500mg, 10ml"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="antibiotic">🦠 Antibiotic</option>
                        <option value="analgesic">💊 Analgesic</option>
                        <option value="antihypertensive">🩸 Antihypertensive</option>
                        <option value="antidiabetic">💉 Antidiabetic</option>
                        <option value="vitamin">🌟 Vitamin</option>
                        <option value="other">📋 Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Pricing & Description */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="h-5 w-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    Pricing & Additional Information
                  </h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Price ($) *</label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={formData.price}
                          onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter drug description, usage instructions, or additional notes..."
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
                      setEditingDrug(null);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
                  >
                    {editingDrug ? 'Update Drug' : 'Create Drug'}
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

export default DrugManagement;