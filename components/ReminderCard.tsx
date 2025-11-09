import React, { useState, useRef } from 'react';
import { Reminder, ReminderStatus, ReminderType } from '../types';
import { CreditCardIcon } from './icons/CreditCardIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { TaskIcon } from './icons/TaskIcon';
import { WhatsAppIcon } from './icons/ContactIcon';
import { CheckIcon } from './icons/CheckIcon';
import { SnoozeIcon } from './icons/SnoozeIcon';
import { DeleteIcon } from './icons/DeleteIcon';

interface ReminderCardProps {
  reminder: Reminder;
  onUpdateStatus: (id: string, status: ReminderStatus) => void;
  onSnooze: (id: string) => void;
  onDelete: (id: string) => void;
  t: (key: string) => string;
}

const SWIPE_ACTION_WIDTH = 80; // in pixels
const SWIPE_THRESHOLD = SWIPE_ACTION_WIDTH / 2;


const TypeIcon: React.FC<{ type: ReminderType }> = ({ type }) => {
  const iconClass = "w-8 h-8";
  switch (type) {
    case ReminderType.CALL:
      return <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full"><PhoneIcon className={`${iconClass} text-blue-500 dark:text-primary-dark`} /></div>;
    case ReminderType.DEBIT:
      return <div className="bg-red-100 dark:bg-red-900/50 p-3 rounded-full"><CreditCardIcon className={`${iconClass} text-red-500 dark:text-danger-dark`} /></div>;
    case ReminderType.TASK:
      return <div className="bg-yellow-100 dark:bg-yellow-900/50 p-3 rounded-full"><TaskIcon className={`${iconClass} text-yellow-500 dark:text-secondary-dark`} /></div>;
    case ReminderType.WHATSAPP:
      return <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-full"><WhatsAppIcon className={`${iconClass} text-green-500 dark:text-green-400`} /></div>;
    default:
      return null;
  }
};

const formatDueDate = (timestamp: number, t: (key: string) => string) => {
  const now = Date.now();
  const diffSeconds = Math.round((timestamp - now) / 1000);
  const diffDays = Math.round(diffSeconds / (60 * 60 * 24));

  if (diffSeconds < 0) {
    const absSeconds = Math.abs(diffSeconds);
    if (absSeconds < 60) return t('overdue_by') + ` ${absSeconds}s`;
    if (absSeconds < 3600) return t('overdue_by') + ` ${Math.round(absSeconds / 60)}m`;
    if (absSeconds < 86400) return t('overdue_by') + ` ${Math.round(absSeconds / 3600)}h`;
    return t('overdue_by') + ` ${Math.abs(diffDays)}d`;
  } else {
    if (diffSeconds < 60) return t('due_in') + ` ${diffSeconds}s`;
    if (diffSeconds < 3600) return t('due_in') + ` ${Math.round(diffSeconds / 60)}m`;
    if (diffSeconds < 86400) return t('due_in') + ` ${Math.round(diffSeconds / 3600)}h`;
    return t('due_in') + ` ${diffDays}d`;
  }
};

const ActionButton: React.FC<{ onClick: () => void; children: React.ReactNode; label: string; className?: string }> = ({ onClick, children, label, className = '' }) => (
    <button onClick={onClick} aria-label={label} className={`p-2 rounded-full transition-colors ${className}`}>
        {children}
    </button>
);

const sendWhatsAppMessage = (number?: string, message?: string) => {
    if (!number) return;
    const cleanedNumber = number.replace(/\D/g, '');
    const encodedMsg = encodeURIComponent(message || "");
    const whatsappURL = `https://wa.me/${cleanedNumber}?text=${encodedMsg}`;
    window.open(whatsappURL, '_blank');
};


export const ReminderCard: React.FC<ReminderCardProps> = ({ reminder, onUpdateStatus, onSnooze, onDelete, t }) => {
  const isCompleted = reminder.status === ReminderStatus.COMPLETED;
  const isOverdue = !isCompleted && reminder.due_timestamp < Date.now();

  const [offsetX, setOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const isDeleting = useRef(false);

  const cardBgClass = isCompleted 
    ? 'bg-gray-100 dark:bg-gray-800'
    : isOverdue
    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
    : 'bg-surface dark:bg-surface-dark border-gray-200 dark:border-gray-700';

  const textClass = isCompleted ? 'text-gray-500 dark:text-gray-400' : 'text-on-surface dark:text-on-surface-dark';
  const titleClass = isCompleted ? 'line-through' : '';

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isCompleted) return;
    dragStartX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isCompleted) return;
    const deltaX = e.touches[0].clientX - dragStartX.current;
    const newOffsetX = Math.min(0, Math.max(-SWIPE_ACTION_WIDTH, deltaX));
    setOffsetX(newOffsetX);
  };

  const handleTouchEnd = () => {
    if (!isDragging || isCompleted) return;
    setIsDragging(false);
    if (offsetX < -SWIPE_THRESHOLD) {
      setOffsetX(-SWIPE_ACTION_WIDTH);
    } else {
      setOffsetX(0);
    }
  };

  const handleDeleteAction = () => {
    // Prevent multiple delete calls
    if (isDeleting.current) return;
    isDeleting.current = true;
    
    // Animate back if swiped, and then delete
    setOffsetX(0);
    setTimeout(() => {
        onDelete(reminder.id);
        // The component will unmount, so no need to reset the ref.
    }, 200);
  };

  const contentStyle: React.CSSProperties = {
    transform: `translateX(${offsetX}px)`,
    transition: isDragging ? 'none' : 'transform 0.2s ease-out',
  };

  return (
    <div className="relative rounded-xl shadow-md overflow-hidden bg-danger dark:bg-danger-dark">
      {/* Background Delete Action */}
      {!isCompleted && (
        <div 
          className="absolute top-0 right-0 h-full flex items-center justify-center text-white"
          style={{ width: `${SWIPE_ACTION_WIDTH}px` }}
        >
          <button 
            onClick={handleDeleteAction} 
            className="font-bold flex flex-col items-center justify-center gap-1 h-full w-full"
            aria-label={t('delete')}
            style={{ pointerEvents: offsetX === -SWIPE_ACTION_WIDTH ? 'auto' : 'none' }}
          >
            <DeleteIcon className="w-6 h-6"/>
            <span>{t('delete')}</span>
          </button>
        </div>
      )}

      {/* Main Card Content (the sliding part) */}
      <div
        style={contentStyle}
        className={`relative z-10 w-full flex flex-col rounded-xl border transition-all duration-300 transform hover:shadow-lg hover:-translate-y-1 ${cardBgClass}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        <div className="p-4 flex-grow">
          <div className="flex items-start gap-4">
              <TypeIcon type={reminder.type} />
              <div className="flex-1">
                  <h3 className={`font-bold text-lg ${textClass} ${titleClass}`}>{reminder.title}</h3>
                  {reminder.description && <p className={`text-sm mt-1 ${textClass} opacity-80`}>{reminder.description}</p>}
                  
                  {reminder.type === ReminderType.DEBIT && (
                      <div className="text-sm mt-2 text-gray-600 dark:text-gray-300">
                          {reminder.amount && <span className="font-semibold">₹{reminder.amount}</span>}
                          {reminder.recipient_name && <span> to {reminder.recipient_name}</span>}
                          {(reminder.payment_mode === 'upi' || !reminder.payment_mode) && reminder.upi_id && <span className="block text-xs italic opacity-70">{reminder.upi_id}</span>}
                          {reminder.payment_mode === 'mobile' && reminder.mobile_number && <span className="block text-xs italic opacity-70">via Mobile: {reminder.mobile_number}</span>}
                      </div>
                  )}
                   {(reminder.type === ReminderType.CALL || reminder.type === ReminderType.WHATSAPP) && (
                      <div className="text-sm mt-2 text-gray-600 dark:text-gray-300">
                          {reminder.recipient_name && <span className="font-semibold">{reminder.recipient_name}</span>}
                          {reminder.phone && <span className="block text-xs italic opacity-70">{reminder.phone}</span>}
                      </div>
                  )}
              </div>
          </div>
        </div>
        <div className={`p-3 border-t ${isCompleted ? 'border-gray-200 dark:border-gray-700' : 'border-inherit'} flex justify-between items-center`}>
          <div className={`text-sm font-semibold ${isOverdue ? 'text-red-600 dark:text-danger-dark' : 'text-gray-500 dark:text-gray-400'}`}>
              {isCompleted ? t('completed') : formatDueDate(reminder.due_timestamp, t)}
          </div>
          <div className="flex items-center gap-1">
              {!isCompleted && (
                  <>
                      {reminder.type === ReminderType.WHATSAPP && (
                           <ActionButton 
                              onClick={() => sendWhatsAppMessage(reminder.phone, reminder.description)} 
                              label={t('send_whatsapp')} 
                              className="hover:bg-green-100 dark:hover:bg-green-900/50 text-green-600 dark:text-green-400"
                          >
                              <WhatsAppIcon className="w-5 h-5" />
                          </ActionButton>
                      )}
                      <ActionButton onClick={() => onUpdateStatus(reminder.id, ReminderStatus.COMPLETED)} label={t('mark_complete')} className="hover:bg-green-100 dark:hover:bg-green-900/50 text-green-600 dark:text-green-400">
                          <CheckIcon className="w-5 h-5" />
                      </ActionButton>
                      <ActionButton onClick={() => onSnooze(reminder.id)} label={t('snooze')} className="hover:bg-yellow-100 dark:hover:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400">
                          <SnoozeIcon className="w-5 h-5" />
                      </ActionButton>
                  </>
              )}
               <ActionButton onClick={handleDeleteAction} label={t('delete')} className="hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-danger-dark">
                  <DeleteIcon className="w-5 h-5" />
              </ActionButton>
          </div>
        </div>
      </div>
    </div>
  );
};