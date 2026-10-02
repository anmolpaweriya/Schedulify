import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    siteLogo: '',
    siteName: 'Schedulify',
    primaryColor: '#ea580c',
    secondaryColor: '#ffedd5',
    themeMode: 'light',
  });

  const fetchThemeSettings = async () => {
    try {
      const res = await axios.get('/api/settings/public');
      if (res.data.success && res.data.settings) {
        applyTheme(res.data.settings);
      }
    } catch (err) {
      console.error('Error fetching public theme settings:', err.message);
    }
  };

  const applyTheme = (settings) => {
    setTheme(settings);

    // Apply CSS variables on document root
    const root = document.documentElement;
    if (settings.primaryColor) {
      root.style.setProperty('--saffron', settings.primaryColor);
      root.style.setProperty('--theme-primary', settings.primaryColor);
    }
    if (settings.secondaryColor) {
      root.style.setProperty('--theme-secondary', settings.secondaryColor);
    }

    if (settings.themeMode === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  useEffect(() => {
    fetchThemeSettings();
  }, []);

  const updateTheme = (newSettings) => {
    applyTheme({ ...theme, ...newSettings });
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, fetchThemeSettings }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
