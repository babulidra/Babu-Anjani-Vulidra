
import React from 'react';
import { CloseIcon } from './icons/CloseIcon';
import { WarningIcon } from './icons/WarningIcon';

interface ConfirmActionModalProps {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
}

export const ConfirmActionModal: React.FC<ConfirmActionModalProps> = ({
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  isOpen,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-surface dark:bg-surface-dark rounded-lg shadow-xl w-full max-w-md mx-auto relative animate-fade-in">
        <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-on-surface dark:text-on-surface-dark flex items-center gap-2">
            <WarningIcon className="w-6 h-6 text-danger dark:text-danger-dark" />
            {title}
          </h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-on-surface dark:text-on-surface-dark">{message}</p>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-black/20 border-t dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-semibold dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-danger text-white rounded-md hover:bg-red-700 font-semibold dark:bg-danger-dark dark:hover:bg-red-500"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
