// Fix: Provide full content for ProfileModal.tsx
import React, { useState } from 'react';
import { User } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { EditIcon } from './icons/EditIcon';
import { CheckIcon } from './icons/CheckIcon';

interface ProfileModalProps {
  user: User;
  onClose: () => void;
  onSave: (updatedUser: Partial<User>) => void;
  t: (key: string) => string;
}

const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed";
const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-left";


export const ProfileModal: React.FC<ProfileModalProps> = ({ user, onClose, onSave, t }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user.displayName);
  const [email, setEmail] = useState(user.email);

  const handleSave = () => {
    onSave({ displayName, email });
    setIsEditing(false);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-surface dark:bg-surface-dark rounded-lg shadow-xl w-full max-w-md mx-auto relative">
         <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-on-surface dark:text-on-surface-dark">{t('profile')}</h2>
          <div className="flex items-center gap-4">
            {isEditing ? (
              <button onClick={handleSave} className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 p-1 rounded-full hover:bg-green-100 dark:hover:bg-green-900/50">
                <CheckIcon className="w-6 h-6" />
              </button>
            ) : (
              <button onClick={() => setIsEditing(true)} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                <EditIcon className="w-6 h-6" />
              </button>
            )}
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="p-6 text-center">
            <img 
                src={user.photoURL} 
                alt="User profile" 
                className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-primary dark:border-primary-dark"
            />
            <div className="space-y-4">
               <div>
                  <label htmlFor="displayName" className={labelClasses}>Display Name</label>
                  <input type="text" id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className={inputClasses} disabled={!isEditing} />
                </div>
                 <div>
                  <label htmlFor="email" className={labelClasses}>Email</label>
                  <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClasses} disabled={!isEditing} />
                </div>
            </div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-black/20 border-t dark:border-gray-700 flex justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-semibold dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500">Close</button>
        </div>
      </div>
    </div>
  );
};