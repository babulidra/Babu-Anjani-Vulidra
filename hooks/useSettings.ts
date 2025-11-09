import { useState, useCallback, useEffect } from 'react';
import { Settings } from '../types';
import { MOCK_SETTINGS } from '../constants';

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const storedSettings = localStorage.getItem('app-settings');
      if (storedSettings) {
        // Merge stored settings with mock settings to ensure all keys are present
        return { ...MOCK_SETTINGS, ...JSON.parse(storedSettings) };
      }
    } catch (error) {
      console.error("Failed to parse settings from localStorage", error);
    }
    return MOCK_SETTINGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('app-settings', JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save settings to localStorage", error);
    }

    // Apply theme
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    if (settings.theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(settings.theme);
    }

  }, [settings]);

  const updateSettings = useCallback((updatedSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...updatedSettings }));
  }, []);

  return {
    settings,
    actions: {
      update: updateSettings,
    },
  };
};
