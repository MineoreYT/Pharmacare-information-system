import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { 
  PaintBrushIcon, 
  ComputerDesktopIcon,
  SwatchIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const Settings = () => {
  const { currentTheme, themes, changeTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('appearance');

  const tabs = [
    { id: 'appearance', name: 'Appearance', icon: PaintBrushIcon },
    { id: 'display', name: 'Display', icon: ComputerDesktopIcon },
    { id: 'preferences', name: 'Preferences', icon: SwatchIcon }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-white via-white to-indigo-50/30 rounded-2xl p-8 shadow-xl border border-indigo-200/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent"></div>
        <div className="relative">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent mb-2 tracking-tight">Settings</h1>
          <p className="text-gray-600 text-lg font-medium">Customize your PharmaCare experience</p>
        </div>
      </div>

      {/* Settings Content */}
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
                      ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg'
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
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              {/* Theme Selection */}
              <div className="bg-gradient-to-br from-white via-white to-purple-50/20 rounded-2xl p-8 shadow-xl border border-purple-200/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent"></div>
                <div className="relative">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Theme Selection</h3>
                  <p className="text-gray-600 mb-6">Choose your preferred interface theme</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(themes).map(([themeKey, theme]) => (
                      <div
                        key={themeKey}
                        className={`
                          relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg
                          ${currentTheme === themeKey
                            ? 'border-indigo-500 bg-indigo-50/50 shadow-lg'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                          }
                        `}
                        onClick={() => changeTheme(themeKey)}
                      >
                        {currentTheme === themeKey && (
                          <div className="absolute top-4 right-4">
                            <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                              <CheckIcon className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        )}
                        
                        {/* Theme Preview */}
                        <div className="mb-4">
                          <div className="h-24 rounded-lg overflow-hidden border border-gray-200">
                            {/* Sidebar Preview */}
                            <div className="flex h-full">
                              <div className={`w-1/3 ${theme.sidebar.background.split(' ')[0]} ${theme.sidebar.background.includes('gradient') ? theme.sidebar.background : ''}`}>
                                <div className="p-2">
                                  <div className={`w-6 h-6 ${theme.sidebar.logo} rounded mb-2`}></div>
                                  <div className="space-y-1">
                                    <div className="w-full h-2 bg-white/20 rounded"></div>
                                    <div className="w-3/4 h-2 bg-white/20 rounded"></div>
                                    <div className="w-full h-2 bg-white/30 rounded"></div>
                                  </div>
                                </div>
                              </div>
                              {/* Content Preview */}
                              <div className="flex-1 bg-gray-50 p-2">
                                <div className="w-full h-3 bg-white rounded mb-2"></div>
                                <div className="grid grid-cols-2 gap-1">
                                  <div className="h-8 bg-white rounded"></div>
                                  <div className="h-8 bg-white rounded"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <h4 className="font-semibold text-gray-900 mb-1">{theme.name}</h4>
                        <p className="text-sm text-gray-600">{theme.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>


            </div>
          )}

          {activeTab === 'display' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-white via-white to-blue-50/20 rounded-2xl p-8 shadow-xl border border-blue-200/30">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Display Settings</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Compact Mode</h4>
                      <p className="text-sm text-gray-600">Reduce spacing for more content</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">High Contrast</h4>
                      <p className="text-sm text-gray-600">Increase contrast for better visibility</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-white via-white to-green-50/20 rounded-2xl p-8 shadow-xl border border-green-200/30">
                <h3 className="text-xl font-bold text-gray-900 mb-6">User Preferences</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Default Page</label>
                    <select className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option>Dashboard</option>
                      <option>Drug Management</option>
                      <option>Inventory</option>
                      <option>Prescriptions</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Items per Page</label>
                    <select className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500">
                      <option>10</option>
                      <option>25</option>
                      <option>50</option>
                      <option>100</option>
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

export default Settings;