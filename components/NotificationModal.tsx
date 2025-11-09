import React from 'react';
import { Reminder, ReminderStatus, ReminderType } from '../types';
import { CreditCardIcon } from './icons/CreditCardIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { TaskIcon } from './icons/TaskIcon';
import { WhatsAppIcon } from './icons/ContactIcon';
import { SnoozeIcon } from './icons/SnoozeIcon';
import { CheckIcon } from './icons/CheckIcon';
import { DeleteIcon } from './icons/DeleteIcon';

interface NotificationModalProps {
  reminder: Reminder;
  onSnooze: (id: string) => void;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  t: (key: string) => string;
}

const TypeIcon: React.FC<{ type: ReminderType }> = ({ type }) => {
  const iconClass = "w-16 h-16";
  switch (type) {
    case ReminderType.CALL:
      return <div className="bg-blue-100 dark:bg-blue-900/50 p-6 rounded-full"><PhoneIcon className={`${iconClass} text-blue-500 dark:text-primary-dark`} /></div>;
    case ReminderType.DEBIT:
      return <div className="bg-red-100 dark:bg-red-900/50 p-6 rounded-full"><CreditCardIcon className={`${iconClass} text-red-500 dark:text-danger-dark`} /></div>;
    case ReminderType.TASK:
      return <div className="bg-yellow-100 dark:bg-yellow-900/50 p-6 rounded-full"><TaskIcon className={`${iconClass} text-yellow-500 dark:text-secondary-dark`} /></div>;
    case ReminderType.WHATSAPP:
      return <div className="bg-green-100 dark:bg-green-900/50 p-6 rounded-full"><WhatsAppIcon className={`${iconClass} text-green-500 dark:text-green-400`} /></div>;
    default:
      return null;
  }
};

export const NotificationModal: React.FC<NotificationModalProps> = ({ reminder, onSnooze, onComplete, onDelete, t }) => {

  const handlePayNow = () => {
    if (reminder.type !== ReminderType.DEBIT) return;

    let payUrl = '';
    const amount = reminder.amount ? `&am=${reminder.amount}` : '';
    const recipient = reminder.recipient_name ? `&pn=${encodeURIComponent(reminder.recipient_name)}` : '';
    const note = reminder.description ? `&tn=${encodeURIComponent(reminder.description)}` : '';

    const paymentMode = reminder.payment_mode || 'upi';

    if (paymentMode === 'mobile' && reminder.mobile_number) {
      payUrl = `intent://pay?pa=${reminder.mobile_number.replace(/\s/g, '')}@upi#Intent;scheme=upi;end;`;
    } else if (paymentMode === 'upi' && reminder.upi_id) {
        if (reminder.upi_id.startsWith('upi://')) {
            payUrl = reminder.upi_id;
        } else {
            payUrl = `upi://pay?pa=${reminder.upi_id}${recipient}${amount}${note}&cu=INR`;
        }
    }

    if (payUrl) {
      window.open(payUrl, '_blank');
      onComplete(reminder.id);
    }
  };
  
  const handleSendWhatsApp = () => {
      if (reminder.type !== ReminderType.WHATSAPP || !reminder.phone) return;
      const cleanedNumber = reminder.phone.replace(/\D/g, '');
      const encodedMsg = encodeURIComponent(reminder.description || "");
      const whatsappURL = `https://wa.me/${cleanedNumber}?text=${encodedMsg}`;
      window.open(whatsappURL, '_blank');
      onComplete(reminder.id);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-[100] p-4 animate-fade-in">
      <div className="bg-surface dark:bg-surface-dark rounded-2xl shadow-xl w-full max-w-lg mx-auto text-center p-8 flex flex-col items-center animate-zoom-in">
        <TypeIcon type={reminder.type} />
        
        <h2 className="text-3xl font-bold text-on-surface dark:text-on-surface-dark mt-6">{reminder.title}</h2>
        
        {reminder.description && (
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-2 max-w-md">{reminder.description}</p>
        )}

        {reminder.type === ReminderType.DEBIT && (
            <div className="text-lg mt-4 text-gray-700 dark:text-gray-200">
                {reminder.amount && <span className="font-semibold text-2xl">₹{reminder.amount}</span>}
                {reminder.recipient_name && <p>To: {reminder.recipient_name}</p>}
                {(reminder.payment_mode === 'upi' || !reminder.payment_mode) && reminder.upi_id && <p className="text-sm italic opacity-70">{reminder.upi_id}</p>}
                {reminder.payment_mode === 'mobile' && reminder.mobile_number && <p className="text-sm italic opacity-70">via Mobile: {reminder.mobile_number}</p>}
            </div>
        )}
         {(reminder.type === ReminderType.CALL || reminder.type === ReminderType.WHATSAPP) && (
            <div className="text-lg mt-4 text-gray-700 dark:text-gray-200">
                {reminder.recipient_name && <p className="font-semibold text-2xl">{(reminder.type === ReminderType.CALL ? t('call') : t('whatsapp'))} {reminder.recipient_name}</p>}
                {reminder.phone && <p>{reminder.phone}</p>}
            </div>
        )}

        <div className="mt-8 w-full flex flex-col sm:flex-row justify-center gap-4">
            {reminder.type === ReminderType.DEBIT && (
                 <button
                    onClick={handlePayNow}
                    className="w-full sm:w-auto flex-1 px-6 py-4 bg-primary text-white rounded-lg hover:bg-blue-700 font-semibold text-lg flex items-center justify-center gap-2 transition-transform transform hover:scale-105 order-1 sm:order-2"
                >
                    <CreditCardIcon className="w-6 h-6" />
                    {t('pay_now')}
                </button>
            )}
             {reminder.type === ReminderType.WHATSAPP && (
                 <button
                    onClick={handleSendWhatsApp}
                    className="w-full sm:w-auto flex-1 px-6 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold text-lg flex items-center justify-center gap-2 transition-transform transform hover:scale-105 order-1 sm:order-2"
                >
                    <WhatsAppIcon className="w-6 h-6" />
                    {t('send_whatsapp')}
                </button>
            )}
            <button
                onClick={() => onSnooze(reminder.id)}
                className="w-full sm:w-auto flex-1 px-6 py-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-semibold text-lg flex items-center justify-center gap-2 transition-transform transform hover:scale-105 order-2 sm:order-1"
            >
                <SnoozeIcon className="w-6 h-6" />
                {t('snooze')}
            </button>
            <button
                onClick={() => onComplete(reminder.id)}
                className={`w-full sm:w-auto flex-1 px-6 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold text-lg items-center justify-center gap-2 transition-transform transform hover:scale-105 order-3 ${reminder.type === ReminderType.DEBIT || reminder.type === ReminderType.WHATSAPP ? 'hidden sm:flex' : 'flex'}`}
            >
                <CheckIcon className="w-6 h-6" />
                {t('mark_complete')}
            </button>
        </div>

        <button
            onClick={() => onDelete(reminder.id)}
            className="mt-8 text-sm text-gray-500 dark:text-gray-400 hover:text-danger dark:hover:text-danger-dark hover:underline flex items-center justify-center gap-1 transition-colors"
            aria-label={t('delete_reminder_aria')}
        >
            <DeleteIcon className="w-4 h-4" />
            {t('delete_reminder')}
        </button>
      </div>
    </div>
  );
};