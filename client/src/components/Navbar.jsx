import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();

  return (
    <nav className={`${theme.navbar.background} fixed top-0 left-0 right-0 z-40`}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2.5 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 transition-all duration-300 hover:scale-105"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <div className="flex-shrink-0 flex items-center ml-4 lg:ml-0">
              <div className={`h-12 w-12 ${theme.navbar.logo} rounded-xl flex items-center justify-center mr-4 shadow-lg ring-2 ring-blue-200/30`}>
                <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div className="flex flex-col justify-center">
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent tracking-tight leading-tight">
                  PharmaCare
                </h1>
                <p className="text-xs text-gray-500 font-medium tracking-wide leading-tight">Information System</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 transition-all duration-300 hover:scale-105 group">
              <BellIcon className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
              <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-gradient-to-r from-red-500 to-red-600 rounded-full animate-pulse shadow-lg"></span>
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold text-gray-900 tracking-wide">
                  {user?.profile?.firstName} {user?.profile?.lastName}
                </div>
                <div className="text-xs text-gray-500 capitalize flex items-center font-medium">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full mr-1.5 animate-pulse shadow-sm"></div>
                  {user?.role?.replace('_', ' ')}
                </div>
              </div>
              
              <div className="relative group">
                <button
                  className="bg-gradient-to-br from-blue-700 to-blue-800 p-1.5 rounded-xl text-sm text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ring-2 ring-blue-200/30"
                  title="User Menu"
                >
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold shadow-inner">
                    {user?.profile?.firstName?.[0]}{user?.profile?.lastName?.[0]}
                  </div>
                </button>
                <div className="absolute right-0 top-full mt-3 w-52 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 ring-1 ring-black/5">
                  <div className="p-4 border-b border-gray-100/80">
                    <p className="text-sm font-semibold text-gray-900 tracking-wide">{user?.profile?.firstName} {user?.profile?.lastName}</p>
                    <p className="text-xs text-gray-500 mt-0.5 font-medium">{user?.email}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50/80 rounded-b-xl transition-all duration-200 font-medium hover:text-red-700"
                  >
                    <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;