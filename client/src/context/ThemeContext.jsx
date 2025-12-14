import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme configurations
export const themes = {
  sophisticated: {
    name: 'Sophisticated',
    description: 'Clean white sidebar with blue accents matching the reference design',
    sidebar: {
      background: 'bg-white shadow-lg border-r border-gray-200',
      overlay: '',
      logo: 'bg-gradient-to-br from-blue-500 to-blue-600',
      navigation: {
        active: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg rounded-lg',
        inactive: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }
    },
    navbar: {
      background: 'bg-white shadow-sm border-b border-gray-200',
      logo: 'bg-gradient-to-br from-blue-500 to-blue-600'
    },
    cards: {
      background: 'bg-white',
      shadow: 'shadow-sm',
      border: 'border-gray-200'
    },
    buttons: {
      primary: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all duration-200'
    }
  },
  
  clean: {
    name: 'Clean Professional',
    description: 'Clean, minimal design with subtle shadows and professional appearance',
    sidebar: {
      background: 'bg-green-800',
      overlay: '',
      logo: 'bg-white',
      navigation: {
        active: 'bg-green-700 text-white shadow-lg',
        inactive: 'text-green-100 hover:bg-green-700 hover:text-white'
      }
    },
    navbar: {
      background: 'bg-white shadow-sm border-b border-gray-200',
      logo: 'bg-green-800'
    },
    cards: {
      background: 'bg-white',
      shadow: 'shadow-sm',
      border: 'border-gray-200'
    },
    buttons: {
      primary: 'bg-green-600 hover:bg-green-700 transition-colors duration-200'
    }
  },

  classic: {
    name: 'Classic Original',
    description: 'Original glass morphism design with blue gradients and elegant effects',
    sidebar: {
      background: 'bg-white/95 backdrop-blur-sm shadow-xl border-r border-gray-200',
      overlay: '',
      logo: 'bg-gradient-to-br from-blue-500 to-cyan-600',
      navigation: {
        active: 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg',
        inactive: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
      }
    },
    navbar: {
      background: 'bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200/50',
      logo: 'bg-gradient-to-br from-blue-500 to-cyan-600'
    },
    cards: {
      background: 'bg-white/80 backdrop-blur-sm',
      shadow: 'shadow-xl',
      border: 'border-white/20'
    },
    buttons: {
      primary: 'bg-gradient-to-br from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105'
    }
  },

  blueOriginal: {
    name: 'Blue Original',
    description: 'The original clean white sidebar with blue accents from your screenshots',
    sidebar: {
      background: 'bg-white shadow-lg border-r border-gray-200',
      overlay: '',
      logo: 'bg-gradient-to-br from-blue-500 to-blue-600',
      navigation: {
        active: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg rounded-lg',
        inactive: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }
    },
    navbar: {
      background: 'bg-white shadow-sm border-b border-gray-200',
      logo: 'bg-gradient-to-br from-blue-500 to-blue-600'
    },
    cards: {
      background: 'bg-white',
      shadow: 'shadow-sm',
      border: 'border-gray-200'
    },
    buttons: {
      primary: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all duration-200'
    }
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('sophisticated');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('pharmacare-theme');
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Save theme to localStorage when changed
  useEffect(() => {
    localStorage.setItem('pharmacare-theme', currentTheme);
  }, [currentTheme]);

  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
    }
  };

  const getThemeClasses = (component) => {
    const theme = themes[currentTheme];
    
    switch (component) {
      case 'sidebar':
        return theme.sidebar;
      case 'navbar':
        return theme.navbar;
      case 'cards':
        return theme.cards;
      case 'buttons':
        return theme.buttons;
      default:
        return {};
    }
  };

  const value = {
    currentTheme,
    themes,
    changeTheme,
    getThemeClasses,
    theme: themes[currentTheme]
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};