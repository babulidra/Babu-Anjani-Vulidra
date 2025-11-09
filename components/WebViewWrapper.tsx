import React from 'react';
import { CloseIcon } from './icons/CloseIcon';

interface WebViewWrapperProps {
  url: string;
  title: string;
  onClose: () => void;
}

export const WebViewWrapper: React.FC<WebViewWrapperProps> = ({ url, title, onClose }) => {
  return (
    <div className="fixed inset-0 bg-surface dark:bg-surface-dark z-50 flex flex-col">
      <header className="bg-surface dark:bg-surface-dark shadow-md flex-shrink-0">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-lg font-bold text-on-surface dark:text-on-surface-dark">{title}</h1>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <CloseIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </header>
      <main className="flex-grow">
        <iframe
          src={url}
          title={title}
          className="w-full h-full border-none"
        />
      </main>
    </div>
  );
};
