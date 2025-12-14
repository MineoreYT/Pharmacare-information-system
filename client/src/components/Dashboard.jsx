import { useState, useEffect } from 'react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalDrugs: 0,
    totalInventory: 0,
    pendingPrescriptions: 0,
    lowStockAlerts: 0,
    expiringItems: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [
        drugsRes,
        inventoryRes
      ] = await Promise.all([
        axios.get('/drugs?limit=1'),
        axios.get('/inventory?limit=1')
      ]);

      setStats({
        totalDrugs: drugsRes.data.total || 0,
        totalInventory: inventoryRes.data.total || 0,
        pendingPrescriptions: 0,
        lowStockAlerts: 0,
        expiringItems: 0
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 shadow-xl relative overflow-hidden">
        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Dashboard</h1>
              <p className="text-blue-100 text-lg font-medium">Real-time overview of your pharmacy operations and key metrics</p>
              <div className="flex items-center space-x-6 mt-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-blue-100 text-sm font-medium">System Online</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                  <span className="text-blue-100 text-sm font-medium">Live Updates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="group bg-gradient-to-br from-white to-blue-50/30 rounded-2xl p-6 shadow-xl border border-blue-200/30 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2 tracking-wide uppercase">Total Drugs</p>
              <p className="text-3xl font-bold text-gray-900 tracking-tight">
                {loading ? (
                  <div className="animate-pulse bg-gradient-to-r from-gray-200 to-gray-300 h-8 w-16 rounded-lg"></div>
                ) : (
                  <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">{stats.totalDrugs}</span>
                )}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg ring-4 ring-blue-100/50 group-hover:scale-110 transition-transform duration-300">
              <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="group bg-gradient-to-br from-white to-green-50/30 rounded-2xl p-6 shadow-xl border border-green-200/30 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2 tracking-wide uppercase">Inventory Items</p>
              <p className="text-3xl font-bold text-gray-900 tracking-tight">
                {loading ? (
                  <div className="animate-pulse bg-gradient-to-r from-gray-200 to-gray-300 h-8 w-16 rounded-lg"></div>
                ) : (
                  <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">{stats.totalInventory}</span>
                )}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg ring-4 ring-green-100/50 group-hover:scale-110 transition-transform duration-300">
              <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="group bg-gradient-to-br from-white to-purple-50/30 rounded-2xl p-6 shadow-xl border border-purple-200/30 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2 tracking-wide uppercase">Pending Prescriptions</p>
              <p className="text-3xl font-bold text-gray-900 tracking-tight">
                {loading ? (
                  <div className="animate-pulse bg-gradient-to-r from-gray-200 to-gray-300 h-8 w-16 rounded-lg"></div>
                ) : (
                  <span className="bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">{stats.pendingPrescriptions}</span>
                )}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg ring-4 ring-purple-100/50 group-hover:scale-110 transition-transform duration-300">
              <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="group bg-gradient-to-br from-white to-red-50/30 rounded-2xl p-6 shadow-xl border border-red-200/30 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2 tracking-wide uppercase">Low Stock Alerts</p>
              <p className="text-3xl font-bold text-gray-900 tracking-tight">
                {loading ? (
                  <div className="animate-pulse bg-gradient-to-r from-gray-200 to-gray-300 h-8 w-16 rounded-lg"></div>
                ) : (
                  <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">{stats.lowStockAlerts}</span>
                )}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg ring-4 ring-red-100/50 group-hover:scale-110 transition-transform duration-300">
              <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Low Stock Alerts */}
        <div className="bg-gradient-to-br from-white via-white to-red-50/20 rounded-2xl p-8 shadow-xl border border-red-200/30 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent"></div>
          <div className="relative flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg ring-4 ring-red-100/50">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 tracking-tight">Low Stock Alerts</h3>
            </div>
            <span className="bg-gradient-to-r from-red-100 to-red-200 text-red-800 text-sm font-bold px-4 py-2 rounded-full shadow-sm ring-1 ring-red-300/50">
              {stats.lowStockAlerts} items
            </span>
          </div>
          
          <div className="relative text-center py-8">
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg ring-4 ring-green-100/50">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-700 font-semibold text-lg">All items are well stocked!</p>
            <p className="text-gray-500 text-sm mt-1">No immediate attention required</p>
          </div>
        </div>

        {/* Expiring Items */}
        <div className="bg-gradient-to-br from-white via-white to-yellow-50/20 rounded-2xl p-8 shadow-xl border border-yellow-200/30 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-transparent"></div>
          <div className="relative flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl shadow-lg ring-4 ring-yellow-100/50">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 tracking-tight">Expiring Soon</h3>
            </div>
            <span className="bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 text-sm font-bold px-4 py-2 rounded-full shadow-sm ring-1 ring-yellow-300/50">
              {stats.expiringItems} items
            </span>
          </div>
          
          <div className="relative text-center py-8">
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg ring-4 ring-green-100/50">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-700 font-semibold text-lg">No items expiring soon!</p>
            <p className="text-gray-500 text-sm mt-1">All medications are within safe dates</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
