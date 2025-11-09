import React from 'react';
import { CloseIcon } from './icons/CloseIcon';
import { InfoIcon } from './icons/InfoIcon';
import { MailIcon } from './icons/MailIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { APP_VERSION } from '../constants';


interface AboutModalProps {
  onClose: () => void;
  onShowWebView: (url: string, titleKey: string) => void;
  t: (key: string) => string;
}

export const AboutModal: React.FC<AboutModalProps> = ({ onClose, onShowWebView, t }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-surface dark:bg-surface-dark rounded-lg shadow-xl w-full max-w-md mx-auto relative max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-on-surface dark:text-on-surface-dark flex items-center gap-3">
            <InfoIcon className="w-6 h-6" />
            {t('about_app')}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-6 text-gray-700 dark:text-gray-300">
            {/* Legal Section */}
            <div className="space-y-2">
                <button onClick={() => onShowWebView('https://example.com/privacy.html', 'privacy_policy')} className="w-full text-left font-medium hover:text-primary dark:hover:text-primary-dark transition-colors">
                    {t('privacy_policy')}
                </button>
                <button onClick={() => onShowWebView('https://example.com/terms.html', 'terms_conditions')} className="w-full text-left font-medium hover:text-primary dark:hover:text-primary-dark transition-colors">
                    {t('terms_conditions')}
                </button>
            </div>

            {/* Contact Section */}
            <div className="pt-4 border-t dark:border-gray-700">
                <h3 className="font-semibold text-lg mb-2 text-on-surface dark:text-on-surface-dark">{t('contact_support')}</h3>
                <div className="space-y-2">
                    <a href="mailto:babulidra@gmail.com" className="flex items-center gap-3 text-primary dark:text-primary-dark hover:underline">
                        <MailIcon className="w-5 h-5 flex-shrink-0" />
                        babulidra@gmail.com
                    </a>
                    <a href="tel:+919699973006" className="flex items-center gap-3 text-primary dark:text-primary-dark hover:underline">
                        <PhoneIcon className="w-5 h-5 flex-shrink-0" />
                        9699973006
                    </a>
                </div>
            </div>

            {/* Version Section */}
             <div className="pt-4 border-t dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('app_version')}: {APP_VERSION}
                </p>
            </div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-black/20 border-t dark:border-gray-700 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-semibold dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};