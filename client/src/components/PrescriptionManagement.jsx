import { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusIcon, MagnifyingGlassIcon, EyeIcon, CheckIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const PrescriptionManagement = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDispenseModal, setShowDispenseModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  const [formData, setFormData] = useState({
    patient: {
      id: '',
      name: '',
      age: '',
      gender: 'male',
      phone: '',
      address: '',
      allergies: []
    },
    doctor: {
      name: '',
      license: '',
      specialty: '',
      hospital: ''
    },
    medications: [{
      drug: '',
      dosage: '',
      frequency: '',
      duration: '',
      quantity: '',
      instructions: '',
      substitutionAllowed: false
    }],
    prescriptionDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [dispensingData, setDispensingData] = useState({
    medications: []
  });

  useEffect(() => {
    fetchPrescriptions();
    fetchDrugs();
  }, [searchTerm, filters, pagination.currentPage]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      // TODO: Convert to SQLite API when prescription routes are ready
      // const params = {
      //   page: pagination.currentPage,
      //   limit: 10,
      //   prescriptionNumber: searchTerm,
      //   ...filters
      // };
      
      // const response = await axios.get('/api/prescriptions', { params });
      // setPrescriptions(response.data.prescriptions);
      // setPagination({
      //   currentPage: response.data.currentPage,
      //   totalPages: response.data.totalPages,
      //   total: response.data.total
      // });
      
      // Temporary: Set empty data until prescription SQLite routes are ready
      setPrescriptions([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        total: 0
      });
    } catch (error) {
      console.error('Failed to fetch prescriptions:', error);
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
      const prescriptionData = {
        ...formData,
        patient: {
          ...formData.patient,
          age: parseInt(formData.patient.age),
          allergies: formData.patient.allergies.filter(allergy => allergy.trim())
        },
        medications: formData.medications.map(med => ({
          ...med,
          quantity: parseInt(med.quantity)
        }))
      };

      // TODO: Convert to SQLite API when prescription routes are ready
      // await axios.post('/api/prescriptions', prescriptionData);
      alert('Prescription functionality will be available when SQLite routes are implemented');
      setShowModal(false);
      resetForm();
      fetchPrescriptions();
    } catch (error) {
      console.error('Failed to create prescription:', error);
      alert('Failed to create prescription');
    }
  };

  const handleDispense = async (e) => {
    e.preventDefault();
    try {
      // TODO: Convert to SQLite API when prescription routes are ready
      // await axios.post(`/api/prescriptions/${selectedPrescription._id}/dispense`, dispensingData);
      alert('Prescription dispensing will be available when SQLite routes are implemented');
      setShowDispenseModal(false);
      setSelectedPrescription(null);
      fetchPrescriptions();
      alert('Medication dispensed successfully');
    } catch (error) {
      console.error('Failed to dispense medication:', error);
      alert(error.response?.data?.message || 'Failed to dispense medication');
    }
  };

  const updatePrescriptionStatus = async (prescriptionId, status) => {
    try {
      // TODO: Convert to SQLite API when prescription routes are ready
      // await axios.patch(`/api/prescriptions/${prescriptionId}/status`, { status });
      alert('Prescription status updates will be available when SQLite routes are implemented');
      fetchPrescriptions();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const openDispenseModal = (prescription) => {
    setSelectedPrescription(prescription);
    setDispensingData({
      medications: prescription.medications.map(med => ({
        medicationId: med._id,
        quantityDispensed: med.quantity
      }))
    });
    setShowDispenseModal(true);
  };

  const resetForm = () => {
    setFormData({
      patient: {
        id: '',
        name: '',
        age: '',
        gender: 'male',
        phone: '',
        address: '',
        allergies: []
      },
      doctor: {
        name: '',
        license: '',
        specialty: '',
        hospital: ''
      },
      medications: [{
        drug: '',
        dosage: '',
        frequency: '',
        duration: '',
        quantity: '',
        instructions: '',
        substitutionAllowed: false
      }],
      prescriptionDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
  };

  const addMedication = () => {
    setFormData(prev => ({
      ...prev,
      medications: [...prev.medications, {
        drug: '',
        dosage: '',
        frequency: '',
        duration: '',
        quantity: '',
        instructions: '',
        substitutionAllowed: false
      }]
    }));
  };

  const removeMedication = (index) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };

  const updateMedication = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      )
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'verified': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'dispensed': return 'bg-green-100 text-green-800 border-green-300';
      case 'partially_dispensed': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'verified': return '✅';
      case 'dispensed': return '💊';
      case 'partially_dispensed': return '📋';
      case 'cancelled': return '❌';
      default: return '📄';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-8 shadow-xl relative overflow-hidden">
        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Prescription Management</h1>
              <p className="text-purple-100 text-lg font-medium">Create, verify, and dispense prescriptions with complete workflow management</p>
              <div className="flex items-center space-x-6 mt-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-purple-100 text-sm font-medium">{pagination.total} Total Prescriptions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
                  <span className="text-purple-100 text-sm font-medium">Digital Workflow</span>
                </div>
              </div>
            </div>
          </div>
          {(user?.role === 'doctor' || user?.role === 'pharmacist' || user?.role === 'admin') && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border border-white/20"
            >
              <PlusIcon className="h-5 w-5" />
              <span>New Prescription</span>
            </button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-gradient-to-br from-white via-white to-indigo-50/20 rounded-2xl p-8 shadow-xl border border-indigo-200/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent"></div>
        <div className="relative flex items-center space-x-4 mb-8">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg ring-4 ring-purple-100/50">
            <MagnifyingGlassIcon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">Search & Filter Prescriptions</h3>
        </div>
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 tracking-wide uppercase">Search Prescriptions</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by prescription number or patient name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 border border-gray-300/50 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 tracking-wide uppercase">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="block w-full px-4 py-4 border border-gray-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="dispensed">Dispensed</option>
              <option value="partially_dispensed">Partially Dispensed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Prescriptions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                Prescription #
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                Patient
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                Doctor
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                Total
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </td>
              </tr>
            ) : prescriptions.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  No prescriptions found
                </td>
              </tr>
            ) : (
              prescriptions.map((prescription) => (
                <tr key={prescription._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-xs font-medium text-gray-600">
                          {prescription.prescriptionNumber?.charAt(0) || 'T'}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {prescription.prescriptionNumber}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{prescription.patient.name}</div>
                    <div className="text-sm text-gray-500">Age: {prescription.patient.age}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{prescription.doctor.name}</div>
                    <div className="text-sm text-gray-500">{prescription.doctor.specialty}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(prescription.prescriptionDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(prescription.status)}`}>
                      {prescription.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${prescription.totalAmount?.toFixed(2) || '0.00'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedPrescription(prescription)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      {prescription.status === 'pending' && (user?.role === 'pharmacist' || user?.role === 'admin') && (
                        <button
                          onClick={() => updatePrescriptionStatus(prescription._id, 'verified')}
                          className="text-green-600 hover:text-green-900"
                          title="Verify"
                        >
                          <CheckIcon className="h-4 w-4" />
                        </button>
                      )}
                      {(prescription.status === 'verified' || prescription.status === 'partially_dispensed') && 
                       (user?.permissions?.includes('dispense_medication')) && (
                        <button
                          onClick={() => openDispenseModal(prescription)}
                          className="text-purple-600 hover:text-purple-900 text-xs px-2 py-1 border border-purple-300 rounded"
                        >
                          Dispense
                        </button>
                      )}
                      {user?.role === 'pharmacy_tech' && (
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                          View Only
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700 font-medium">
            Showing {((pagination.currentPage - 1) * 10) + 1} to {Math.min(pagination.currentPage * 10, pagination.total)} of {pagination.total} results
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

      {/* Enhanced New Prescription Modal */}
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
                    Create New Prescription
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
                {/* Patient Information */}
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Patient Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Patient ID</label>
                      <input
                        type="text"
                        required
                        value={formData.patient.id}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          patient: { ...prev.patient, id: e.target.value }
                        }))}
                        className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Patient Name</label>
                      <input
                        type="text"
                        required
                        value={formData.patient.name}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          patient: { ...prev.patient, name: e.target.value }
                        }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Age</label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.patient.age}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          patient: { ...prev.patient, age: e.target.value }
                        }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Gender</label>
                      <select
                        value={formData.patient.gender}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          patient: { ...prev.patient, gender: e.target.value }
                        }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <input
                        type="tel"
                        value={formData.patient.phone}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          patient: { ...prev.patient, phone: e.target.value }
                        }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Doctor Information */}
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Doctor Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Doctor Name</label>
                      <input
                        type="text"
                        required
                        value={formData.doctor.name}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          doctor: { ...prev.doctor, name: e.target.value }
                        }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">License Number</label>
                      <input
                        type="text"
                        required
                        value={formData.doctor.license}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          doctor: { ...prev.doctor, license: e.target.value }
                        }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Specialty</label>
                      <input
                        type="text"
                        value={formData.doctor.specialty}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          doctor: { ...prev.doctor, specialty: e.target.value }
                        }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Hospital</label>
                      <input
                        type="text"
                        value={formData.doctor.hospital}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          doctor: { ...prev.doctor, hospital: e.target.value }
                        }))}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Medications */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-md font-medium text-gray-900">Medications</h4>
                    <button
                      type="button"
                      onClick={addMedication}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      + Add Medication
                    </button>
                  </div>
                  {formData.medications.map((medication, index) => (
                    <div key={index} className="border border-gray-200 rounded-md p-4 mb-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-medium text-gray-700">Medication {index + 1}</span>
                        {formData.medications.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMedication(index)}
                            className="text-sm text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Drug</label>
                          <select
                            required
                            value={medication.drug}
                            onChange={(e) => updateMedication(index, 'drug', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select a drug</option>
                            {drugs.map((drug) => (
                              <option key={drug.id} value={drug.id}>
                                {drug.name} - {drug.dosageForm} {drug.strength}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Dosage</label>
                          <input
                            type="text"
                            required
                            value={medication.dosage}
                            onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                            placeholder="e.g., 500mg"
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Frequency</label>
                          <input
                            type="text"
                            required
                            value={medication.frequency}
                            onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                            placeholder="e.g., Twice daily"
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Duration</label>
                          <input
                            type="text"
                            required
                            value={medication.duration}
                            onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                            placeholder="e.g., 7 days"
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Quantity</label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={medication.quantity}
                            onChange={(e) => updateMedication(index, 'quantity', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Instructions</label>
                          <input
                            type="text"
                            value={medication.instructions}
                            onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                            placeholder="e.g., Take with food"
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Prescription Date</label>
                  <input
                    type="date"
                    required
                    value={formData.prescriptionDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, prescriptionDate: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes or instructions..."
                    rows="3"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
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
                    Create Prescription
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dispense Modal */}
      {showDispenseModal && selectedPrescription && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header - Fixed */}
            <div className="flex-shrink-0 bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Dispense Medication
                    </h3>
                    <p className="text-green-100 text-sm">
                      Prescription: {selectedPrescription.prescriptionNumber}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowDispenseModal(false);
                    setSelectedPrescription(null);
                  }}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors duration-200"
                >
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleDispense} className="flex flex-col flex-1 min-h-0">
              {/* Modal Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {selectedPrescription.medications.map((medication, index) => (
                  <div key={medication._id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">{medication.drug?.name}</h4>
                      <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full border border-green-200">
                        Prescribed: {medication.quantity}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Quantity to Dispense
                        </label>
                        <input
                          type="number"
                          required
                          min="1"
                          max={medication.quantity}
                          value={dispensingData.medications[index]?.quantityDispensed || ''}
                          onChange={(e) => {
                            const newMedications = [...dispensingData.medications];
                            newMedications[index] = {
                              ...newMedications[index],
                              quantityDispensed: parseInt(e.target.value)
                            };
                            setDispensingData(prev => ({ ...prev, medications: newMedications }));
                          }}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                        <h5 className="font-semibold text-gray-900 mb-3">Prescription Details</h5>
                        <div className="text-sm text-gray-700 space-y-2">
                          <p><span className="font-medium">Dosage:</span> {medication.dosage}</p>
                          <p><span className="font-medium">Frequency:</span> {medication.frequency}</p>
                          <p><span className="font-medium">Duration:</span> {medication.duration}</p>
                          {medication.instructions && (
                            <p><span className="font-medium">Instructions:</span> {medication.instructions}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Modal Footer - Fixed */}
              <div className="flex-shrink-0 bg-gray-50 px-6 py-4 rounded-b-2xl border-t border-gray-200">
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDispenseModal(false);
                      setSelectedPrescription(null);
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
                  >
                    Dispense Medication
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Prescription Details Modal */}
      {selectedPrescription && !showDispenseModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header - Fixed */}
            <div className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-cyan-600 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <EyeIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Prescription Details
                    </h3>
                    <p className="text-blue-100 text-sm">
                      {selectedPrescription.prescriptionNumber}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPrescription(null)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors duration-200"
                >
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 shadow-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-xl">
                      <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Patient Information</h4>
                  </div>
                  <div className="space-y-3 text-sm text-gray-700">
                    <p><span className="font-medium text-gray-900">Name:</span> {selectedPrescription.patient.name}</p>
                    <p><span className="font-medium text-gray-900">Age:</span> {selectedPrescription.patient.age}</p>
                    <p><span className="font-medium text-gray-900">Gender:</span> {selectedPrescription.patient.gender}</p>
                    {selectedPrescription.patient.phone && (
                      <p><span className="font-medium text-gray-900">Phone:</span> {selectedPrescription.patient.phone}</p>
                    )}
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 shadow-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-xl">
                      <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Doctor Information</h4>
                  </div>
                  <div className="space-y-3 text-sm text-gray-700">
                    <p><span className="font-medium text-gray-900">Name:</span> {selectedPrescription.doctor.name}</p>
                    <p><span className="font-medium text-gray-900">License:</span> {selectedPrescription.doctor.license}</p>
                    <p><span className="font-medium text-gray-900">Specialty:</span> {selectedPrescription.doctor.specialty}</p>
                    {selectedPrescription.doctor.hospital && (
                      <p><span className="font-medium text-gray-900">Hospital:</span> {selectedPrescription.doctor.hospital}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-purple-100 rounded-xl">
                    <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">Prescribed Medications</h4>
                </div>
                <div className="space-y-4">
                  {selectedPrescription.medications.map((medication, index) => (
                    <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                      <div className="flex justify-between items-start mb-4">
                        <h5 className="text-lg font-semibold text-gray-900">{medication.drug?.name}</h5>
                        <span className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full border border-purple-200">
                          Qty: {medication.quantity}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                        <div className="space-y-2">
                          <p><span className="font-medium text-gray-900">Dosage:</span> {medication.dosage}</p>
                          <p><span className="font-medium text-gray-900">Frequency:</span> {medication.frequency}</p>
                        </div>
                        <div className="space-y-2">
                          <p><span className="font-medium text-gray-900">Duration:</span> {medication.duration}</p>
                          {medication.instructions && (
                            <p><span className="font-medium text-gray-900">Instructions:</span> {medication.instructions}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedPrescription.notes && (
                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-6 border border-yellow-200 shadow-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-yellow-100 rounded-xl">
                      <svg className="h-5 w-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Notes</h4>
                  </div>
                  <p className="text-sm text-gray-700">{selectedPrescription.notes}</p>
                </div>
              )}
            </div>

            {/* Modal Footer - Fixed */}
            <div className="flex-shrink-0 bg-gray-50 px-6 py-4 rounded-b-2xl border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className={`inline-flex px-4 py-2 text-sm font-medium rounded-full ${getStatusColor(selectedPrescription.status)}`}>
                  {selectedPrescription.status.replace('_', ' ')}
                </span>
                <div className="text-right bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-4 border border-gray-300 shadow-sm">
                  <p className="text-sm font-medium text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${selectedPrescription.totalAmount?.toFixed(2) || '0.00'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionManagement;