import React, { useEffect } from 'react';
import { Reminder, ReminderType } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { CreditCardIcon } from './icons/CreditCardIcon';
import { TaskIcon } from './icons/TaskIcon';
import { WhatsAppIcon } from './icons/ContactIcon';

interface ToastNotificationProps {
  reminder: Reminder;
  onDismiss: () => void;
}

const TypeIcon = ({ type }: { type: ReminderType }) => {
  const iconClass = "w-6 h-6 flex-shrink-0";
  switch (type) {
    case ReminderType.CALL:
      return <PhoneIcon className={`${iconClass} text-blue-500 dark:text-primary-dark`} />;
    case ReminderType.DEBIT:
      return <CreditCardIcon className={`${iconClass} text-red-500 dark:text-danger-dark`} />;
    case ReminderType.TASK:
      return <TaskIcon className={`${iconClass} text-yellow-500 dark:text-secondary-dark`} />;
    case ReminderType.WHATSAPP:
      return <WhatsAppIcon className={`${iconClass} text-green-500 dark:text-green-400`} />;
    default:
      return null;
  }
};


export const ToastNotification: React.FC<ToastNotificationProps> = ({ reminder, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 10000); // Auto-dismiss after 10 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [onDismiss]);

  return (
    <div className="fixed top-20 right-4 w-full max-w-sm bg-surface dark:bg-surface-dark rounded-xl shadow-2xl border dark:border-gray-700 z-50 animate-fade-in" role="alert" aria-live="assertive">
      <div className="p-4 flex items-start">
        <div className="pt-0.5">
          <TypeIcon type={reminder.type} />
        </div>
        <div className="ml-3 w-0 flex-1">
          <p className="text-sm font-bold text-on-surface dark:text-on-surface-dark">{reminder.title}</p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{reminder.description || 'Due now.'}</p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            onClick={onDismiss}
            className="inline-flex text-gray-400 rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark"
          >
            <span className="sr-only">Close</span>
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};