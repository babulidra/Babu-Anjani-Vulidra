import React, { useState, useEffect } from 'react';
import { Settings, Language, Ringtone } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { RingtoneSelection } from './RingtoneSelection';
import { MOCK_RINGTONES } from '../constants';

interface SettingsModalProps {
  settings: Settings;
  onClose: () => void;
  onSave: (updatedSettings: Partial<Settings>) => void;
  onShowAbout: () => void;
  t: (key: string) => string;
}

const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
const selectClass = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white";

export const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onClose, onSave, onShowAbout, t }) => {
  const [localSettings, setLocalSettings] = useState<Settings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const handleFieldChange = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const handleNotificationChange = <K extends keyof Settings['notifications']>(key: K, value: Settings['notifications'][K]) => {
    setLocalSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }));
  };

  const handleAddCustomRingtone = (ringtone: Ringtone) => {
     if (![...MOCK_RINGTONES, ...localSettings.custom_ringtones].some(r => r.url === ringtone.url)) {
        setLocalSettings(prev => ({
            ...prev,
            custom_ringtones: [...prev.custom_ringtones, ringtone],
            notifications: {
                ...prev.notifications,
                ringtone: ringtone.url, // auto-select new ringtone
            }
        }));
     }
  };
  
  const handleRemoveCustomRingtone = (urlToRemove: string) => {
    setLocalSettings(prev => {
        const newCustomRingtones = prev.custom_ringtones.filter(r => r.url !== urlToRemove);
        let newSelectedRingtone = prev.notifications.ringtone;

        // If the removed ringtone was the currently selected one, fall back to a default ringtone.
        if (prev.notifications.ringtone === urlToRemove) {
            newSelectedRingtone = MOCK_RINGTONES.find(r => r.name === 'Default Beep')?.url || MOCK_RINGTONES[0].url;
        }

        return {
            ...prev,
            custom_ringtones: newCustomRingtones,
            notifications: {
                ...prev.notifications,
                ringtone: newSelectedRingtone,
            }
        };
    });
  };

  const allRingtones = [...MOCK_RINGTONES, ...localSettings.custom_ringtones];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-surface dark:bg-surface-dark rounded-lg shadow-xl w-full max-w-lg mx-auto relative max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-on-surface dark:text-on-surface-dark">{t('settings')}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Theme */}
          <div>
            <label htmlFor="theme" className={labelClass}>Theme</label>
            <select
              id="theme"
              value={localSettings.theme}
              onChange={(e) => handleFieldChange('theme', e.target.value as Settings['theme'])}
              className={selectClass}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
          </div>

          {/* Language */}
          <div>
            <label htmlFor="language" className={labelClass}>Language</label>
            <select
              id="language"
              value={localSettings.language}
              onChange={(e) => handleFieldChange('language', e.target.value as Language)}
              className={selectClass}
            >
              {Object.values(Language).map(lang => (
                <option key={lang} value={lang}>{lang.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* Snooze Duration */}
          <div>
            <label htmlFor="snooze" className={labelClass}>Snooze Duration (minutes)</label>
            <input
              type="number"
              id="snooze"
              min="1"
              max="60"
              value={localSettings.snooze_duration}
              onChange={(e) => handleFieldChange('snooze_duration', Number(e.target.value))}
              className={selectClass}
            />
          </div>

          {/* Notifications */}
          <div className="space-y-4 pt-4 border-t dark:border-gray-700">
             <h3 className="font-semibold text-lg">Notifications</h3>
             <div className="flex items-center justify-between">
                <label htmlFor="sound_alert" className="font-medium text-gray-700 dark:text-gray-300">Enable Sound Alerts</label>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="sound_alert" className="sr-only peer" checked={localSettings.notifications.sound_alert} onChange={e => handleNotificationChange('sound_alert', e.target.checked)} />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
             </div>
             <div className="flex items-center justify-between">
                <label htmlFor="highAlert" className="font-medium text-gray-700 dark:text-gray-300">High-Priority Alert (Fullscreen)</label>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="highAlert" className="sr-only peer" checked={localSettings.notifications.highAlert} onChange={e => handleNotificationChange('highAlert', e.target.checked)} />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
             </div>
              <RingtoneSelection
                ringtones={allRingtones}
                customRingtones={localSettings.custom_ringtones}
                selectedRingtone={localSettings.notifications.ringtone}
                onRingtoneChange={(url) => handleNotificationChange('ringtone', url)}
                onAddCustom={handleAddCustomRingtone}
                onRemoveCustom={handleRemoveCustomRingtone}
              />
          </div>

        </div>

        <div className="p-4 bg-gray-50 dark:bg-black/20 border-t dark:border-gray-700 flex justify-between items-center">
            <button onClick={onShowAbout} className="text-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary-dark hover:underline">
                {t('about_app')}
            </button>
            <div className="flex gap-3">
                <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-semibold dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500">{t('cancel')}</button>
                <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 font-semibold dark:bg-primary-dark dark:text-on-primary dark:hover:bg-blue-500">Save Changes</button>
            </div>
        </div>
      </div>
    </div>
  );
};
