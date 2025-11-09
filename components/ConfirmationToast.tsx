import React, { useEffect } from 'react';
import { CheckIcon } from './icons/CheckIcon';
import { CloseIcon } from './icons/CloseIcon';

interface ConfirmationToastProps {
  message: string;
  onClose: () => void;
}

export const ConfirmationToast: React.FC<ConfirmationToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-20 right-4 w-full max-w-sm bg-surface dark:bg-surface-dark rounded-xl shadow-2xl border-l-4 border-green-500 z-50 animate-fade-in" role="alert" aria-live="assertive">
      <div className="p-4 flex items-start">
        <div className="flex-shrink-0 pt-0.5">
          <CheckIcon className="w-6 h-6 text-green-500" />
        </div>
        <div className="ml-3 w-0 flex-1">
          <p className="text-sm font-bold text-on-surface dark:text-on-surface-dark">{message}</p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            onClick={onClose}
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
