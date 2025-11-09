import React from 'react';
import { BellIcon } from './icons/BellIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { User } from '../types';

interface HeaderProps {
  user: User;
  onShowNotifications: () => void;
  onShowSettings: () => void;
  onShowProfile: () => void;
  unreadCount: number;
  t: (key: string) => string;
}

export const Header: React.FC<HeaderProps> = ({ user, onShowNotifications, onShowSettings, onShowProfile, unreadCount, t }) => {
  return (
    <header className="bg-surface dark:bg-surface-dark shadow-md sticky top-0 z-20">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-on-surface dark:text-on-surface-dark">{t('header_title')}</h1>
        <div className="flex items-center gap-4">
          <button onClick={onShowNotifications} className="relative text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-dark p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <BellIcon className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-danger text-white text-xs flex items-center justify-center transform -translate-y-1/2 translate-x-1/2 ring-2 ring-surface dark:ring-surface-dark">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          <button onClick={onShowSettings} className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-dark p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <SettingsIcon className="w-6 h-6" />
          </button>
           <button onClick={onShowProfile} className="flex items-center gap-2">
            <img 
              src={user.photoURL} 
              alt="User profile" 
              className="w-9 h-9 rounded-full border-2 border-primary dark:border-primary-dark"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
