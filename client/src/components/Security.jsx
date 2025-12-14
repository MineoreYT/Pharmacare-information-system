import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheckIcon, 
  KeyIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const Security = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('password');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const tabs = [
    { id: 'password', name: 'Password', icon: KeyIcon },
    { id: 'sessions', name: 'Active Sessions', icon: ClockIcon },
    { id: 'security', name: 'Security Settings', icon: ShieldCheckIcon }
  ];

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement password change logic
    console.log('Password change submitted:', passwordForm);
  };

  // Mock session data
  const activeSessions = [
    {
      id: 1,
      device: 'Windows PC - Chrome',
      location: 'Manila, Philippines',
      lastActive: '2 minutes ago',
      current: true,
      ip: '192.168.1.100'
    },
    {
      id: 2,
      device: 'Mobile - Safari',
      location: 'Manila, Philippines',
      lastActive: '1 hour ago',
      current: false,
      ip: '192.168.1.101'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-white via-white to-red-50/30 rounded-2xl p-8 shadow-xl border border-red-200/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent"></div>
        <div className="relative flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg ring-4 ring-red-100/50">
            <ShieldCheckIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent mb-2 tracking-tight">Security Center</h1>
            <p className="text-gray-600 text-lg font-medium">Manage your account security and privacy settings</p>
          </div>
        </div>
      </div>

      {/* Security Status */}
      <div className="bg-gradient-to-br from-white via-white to-green-50/20 rounded-2xl p-8 shadow-xl border border-green-200/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg">
              <CheckCircleIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Security Status: Good</h3>
              <p className="text-gray-600">Your account security is up to date</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">85%</div>
            <div className="text-sm text-gray-500">Security Score</div>
          </div>
        </div>
      </div>

      {/* Security Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-white via-white to-gray-50/30 rounded-2xl p-6 shadow-xl border border-gray-200/30 sticky top-8">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 text-left
                    ${activeTab === tab.id
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                  `}
                >
                  <tab.icon className={`mr-3 h-5 w-5 ${activeTab === tab.id ? 'text-white' : 'text-gray-500'}`} />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'password' && (
            <div className="space-y-6">
              {/* Change Password */}
              <div className="bg-gradient-to-br from-white via-white to-blue-50/20 rounded-2xl p-8 shadow-xl border border-blue-200/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent"></div>
                <div className="relative">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Change Password</h3>
                  <p className="text-gray-600 mb-6">Update your password to keep your account secure</p>
                  
                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          name="currentPassword"
                          value={passwordForm.currentPassword}
                          onChange={handlePasswordChange}
                          className="block w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showCurrentPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          name="newPassword"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          className="block w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showNewPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                          className="block w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showConfirmPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="bg-gradient-to-br from-white via-white to-yellow-50/20 rounded-2xl p-8 shadow-xl border border-yellow-200/30">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Password Requirements</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                    At least 8 characters long
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                    Contains uppercase and lowercase letters
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                    Contains at least one number
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                    Contains at least one special character
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'sessions' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-white via-white to-purple-50/20 rounded-2xl p-8 shadow-xl border border-purple-200/30">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Active Sessions</h3>
                
                <div className="space-y-4">
                  {activeSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <ComputerDesktopIcon className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">{session.device}</h4>
                            {session.current && (
                              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                                Current
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{session.location} • {session.ip}</p>
                          <p className="text-xs text-gray-500">Last active: {session.lastActive}</p>
                        </div>
                      </div>
                      {!session.current && (
                        <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                          Terminate
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-white via-white to-orange-50/20 rounded-2xl p-8 shadow-xl border border-orange-200/30">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                    </div>
                    <button className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-colors">
                      Enable
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Login Notifications</h4>
                      <p className="text-sm text-gray-600">Get notified when someone logs into your account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Session Timeout</h4>
                      <p className="text-sm text-gray-600">Automatically log out after inactivity</p>
                    </div>
                    <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>30 minutes</option>
                      <option>1 hour</option>
                      <option>2 hours</option>
                      <option>Never</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Security;