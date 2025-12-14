import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  BeakerIcon, 
  ArchiveBoxIcon, 
  DocumentTextIcon,
  CogIcon,
  ShieldCheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();
  const { theme } = useTheme();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Drug Management', href: '/drugs', icon: BeakerIcon, permission: 'view_inventory' },
    { name: 'Inventory', href: '/inventory', icon: ArchiveBoxIcon, permission: 'view_inventory' },
    { name: 'Prescriptions', href: '/prescriptions', icon: DocumentTextIcon, permission: 'view_prescriptions' },
  ];

  const filteredNavigation = navigation.filter(item => 
    !item.permission || user?.permissions?.includes(item.permission)
  );

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 ${theme.sidebar.background} shadow-2xl backdrop-blur-xl transform transition-all duration-500 ease-out
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Elegant overlay pattern */}
        {theme.sidebar.overlay && (
          <div className={`absolute inset-0 ${theme.sidebar.overlay} pointer-events-none`}></div>
        )}
        
        {/* Mobile Header */}
        <div className="relative flex items-center justify-between h-20 px-4 border-b border-gray-200 backdrop-blur-sm lg:hidden">
          <span className="text-lg font-semibold text-gray-900 tracking-wide">Menu</span>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-300 hover:scale-110"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Logo Section */}
        <div className="relative flex items-center px-6 py-8 border-b border-gray-200">
          <div className={`h-12 w-12 ${theme.sidebar.logo} rounded-xl flex items-center justify-center mr-4 shadow-lg ring-2 ring-blue-200/30`}>
            <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              PharmaCare
            </h2>
            <p className="text-xs text-gray-500 font-medium tracking-wider uppercase">Information System</p>
          </div>
        </div>

        <nav className="mt-8 px-4">
          <ul className="space-y-3">
            {filteredNavigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  {item.separator && (
                    <div className="border-t border-green-700/30 my-4"></div>
                  )}
                  <Link
                    to={item.href}
                    onClick={onClose}
                    className={`
                      group flex items-center px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden
                      ${isActive 
                        ? theme.sidebar.navigation.active
                        : theme.sidebar.navigation.inactive
                      }
                    `}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
                    )}
                    <item.icon 
                      className={`
                        mr-3 h-5 w-5 flex-shrink-0 transition-all duration-300
                        ${isActive ? 'text-white drop-shadow-sm' : 'text-gray-500 group-hover:text-gray-700 group-hover:scale-110'}
                      `}
                    />
                    <span className="relative z-10 tracking-wide">{item.name}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full shadow-sm animate-pulse"></div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 border border-gray-200">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-white/20">
              {user?.profile?.firstName?.[0]}{user?.profile?.lastName?.[0]}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 tracking-wide">{user?.username}</p>
              <p className="text-xs text-gray-500 capitalize font-medium">{user?.role?.replace('_', ' ')}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;