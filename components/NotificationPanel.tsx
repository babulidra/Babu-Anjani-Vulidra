
import React from 'react';
import { Notification as NotificationType, ReminderType } from '../types';
import { PhoneIcon } from './icons/PhoneIcon';
import { CreditCardIcon } from './icons/CreditCardIcon';
import { TaskIcon } from './icons/TaskIcon';

interface NotificationPanelProps {
  notifications: NotificationType[];
  onClearAll: () => void;
  onClose: () => void;
  t: (key: string) => string;
}

const TypeIcon = ({ type }: { type: ReminderType }) => {
  const iconClass = "w-6 h-6 mr-3 flex-shrink-0";
  switch (type) {
    case ReminderType.CALL:
      return <PhoneIcon className={`${iconClass} text-blue-500 dark:text-primary-dark`} />;
    case ReminderType.DEBIT:
      return <CreditCardIcon className={`${iconClass} text-red-500 dark:text-danger-dark`} />;
    case ReminderType.TASK:
      return <TaskIcon className={`${iconClass} text-yellow-500 dark:text-secondary-dark`} />;
    default:
      return null;
  }
};

const formatTimeAgo = (timestamp: number) => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - timestamp) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return "Just now";
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications, onClearAll, onClose, t }) => {
  return (
    <div className="absolute top-full right-4 mt-2 w-80 max-w-sm bg-surface dark:bg-surface-dark rounded-lg shadow-2xl border dark:border-gray-700 z-30 animate-fade-in">
        <div className="p-3 border-b dark:border-gray-700">
            <h3 className="font-bold text-lg text-on-surface dark:text-on-surface-dark">{t('notifications')}</h3>
        </div>
        <ul className="divide-y dark:divide-gray-700 max-h-80 overflow-y-auto">
            {notifications.length > 0 ? (
                notifications.map(notif => (
                    <li key={notif.id} className={`flex items-center p-3 transition-colors duration-200 ${!notif.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                        <TypeIcon type={notif.type} />
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{notif.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{formatTimeAgo(notif.timestamp)}</p>
                        </div>
                    </li>
                ))
            ) : (
                <li className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">{t('no_new_notifications')}</li>
            )}
        </ul>
        {notifications.length > 0 && (
            <div className="p-2 border-t dark:border-gray-700">
                <button 
                    onClick={onClearAll}
                    className="w-full text-center text-sm font-semibold text-danger dark:text-danger-dark py-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                    {t('clear_all_notifications')}
                </button>
            </div>
        )}
    </div>
  );
};