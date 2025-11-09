import React, { useState, useEffect } from 'react';
import { Reminder, ReminderType } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { CreditCardIcon } from './icons/CreditCardIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { TaskIcon } from './icons/TaskIcon';
import { WhatsAppIcon } from './icons/ContactIcon';

interface AddReminderModalProps {
  onClose: () => void;
  // Fix: The Omit type should take a union of keys as its second argument.
  onSave: (reminderData: Omit<Reminder, 'id' | 'user_id' | 'status'>) => void;
  t: (key: string) => string;
}

const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white";
const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

export const AddReminderModal: React.FC<AddReminderModalProps> = ({ onClose, onSave, t }) => {
  const [type, setType] = useState<ReminderType>(ReminderType.TASK);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueTime, setDueTime] = useState('12:00');
  
  // Debit specific
  const [amount, setAmount] = useState<number | ''>('');
  const [paymentRecipientName, setPaymentRecipientName] = useState('');
  const [paymentMode, setPaymentMode] = useState<'upi' | 'mobile'>('upi');
  const [upiId, setUpiId] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  // Call/WhatsApp specific
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  
  const [isContactPickerSupported, setIsContactPickerSupported] = useState(false);
  const [isPickingContact, setIsPickingContact] = useState(false);

  useEffect(() => {
    if ('contacts' in navigator && 'select' in (navigator as any).contacts) {
      setIsContactPickerSupported(true);
    }
  }, []);

  const handleSelectContact = async (contactFieldType: 'call-contact' | 'payment-mobile') => {
    if (!isContactPickerSupported) return;
    setIsPickingContact(true);
    try {
      const contacts = await (navigator as any).contacts.select(['name', 'tel'], { multiple: false });
      if (contacts.length > 0) {
        const contact = contacts[0];
        const name = contact.name?.[0] || '';
        const tel = contact.tel?.[0] || '';

        if (contactFieldType === 'call-contact') {
            setContactName(name);
            setContactPhone(tel);
            if (!title.trim() && name) {
                let prefix = '';
                if (type === ReminderType.CALL) prefix = t('call');
                else if (type === ReminderType.WHATSAPP) prefix = t('whatsapp');
                if (prefix) setTitle(`${prefix} ${name}`);
            }
        } else { // payment-mobile
            setPaymentRecipientName(prev => name || prev);
            setMobileNumber(tel);
            if (!title.trim() && name) {
                setTitle(`${t('pay_to')} ${name}`);
            }
        }
      }
    } catch (error) {
      console.error(`Contact selection for ${contactFieldType} cancelled or failed:`, error);
    } finally {
      setIsPickingContact(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate || !dueTime) {
      alert('Please fill in all required fields.');
      return;
    }

    const due_timestamp = new Date(`${dueDate}T${dueTime}`).getTime();
    
    // Fix: The Omit type should take a union of keys as its second argument.
    let reminderData: Omit<Reminder, 'id' | 'user_id' | 'status'> = {
        title,
        description,
        type,
        due_timestamp,
    };

    if (type === ReminderType.DEBIT) {
        reminderData = {
            ...reminderData,
            amount: Number(amount) || undefined,
            recipient_name: paymentRecipientName || undefined,
            payment_mode: paymentMode,
            upi_id: paymentMode === 'upi' ? upiId : undefined,
            mobile_number: paymentMode === 'mobile' ? mobileNumber : undefined,
        };
    } else if (type === ReminderType.CALL || type === ReminderType.WHATSAPP) {
        reminderData = {
            ...reminderData,
            recipient_name: contactName || undefined,
            phone: contactPhone || undefined,
        };
    }

    onSave(reminderData);
  };

  const TypeButton = ({ value, icon, label }: { value: ReminderType, icon: React.ReactNode, label: string }) => (
      <button
        type="button"
        onClick={() => setType(value)}
        className={`flex-1 flex flex-col items-center justify-center gap-2 p-3 text-sm font-semibold rounded-md transition-all border-2 ${type === value ? 'bg-primary/10 border-primary text-primary dark:bg-primary-dark/20 dark:border-primary-dark dark:text-primary-dark' : 'bg-gray-100 dark:bg-gray-800 border-transparent hover:border-gray-300 dark:hover:border-gray-600'}`}
      >
        {icon}
        {label}
      </button>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
      <form onSubmit={handleSubmit} className="bg-surface dark:bg-surface-dark rounded-lg shadow-xl w-full max-w-lg mx-auto relative max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b dark:border-gray-700">
          <h2 className="text-2xl font-bold text-on-surface dark:text-on-surface-dark">{t('new_reminder')}</h2>
          <button type="button" onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
            <div>
                <label className={labelClass}>{t('type')}</label>
                <div className="flex items-center gap-2">
                    <TypeButton value={ReminderType.TASK} icon={<TaskIcon className="w-6 h-6" />} label={t('task')} />
                    <TypeButton value={ReminderType.DEBIT} icon={<CreditCardIcon className="w-6 h-6" />} label={t('payment')} />
                    <TypeButton value={ReminderType.CALL} icon={<PhoneIcon className="w-6 h-6" />} label={t('call')} />
                    <TypeButton value={ReminderType.WHATSAPP} icon={<WhatsAppIcon className="w-6 h-6" />} label={t('whatsapp')} />
                </div>
            </div>
            
            <div>
                <label htmlFor="title" className={labelClass}>{t('title')} *</label>
                <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} required />
            </div>

            <div>
                <label htmlFor="description" className={labelClass}>{t('description')}</label>
                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} rows={3}></textarea>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="dueDate" className={labelClass}>{t('due_date')} *</label>
                    <input type="date" id="dueDate" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={inputClass} required />
                 </div>
                 <div>
                    <label htmlFor="dueTime" className={labelClass}>{t('due_time')} *</label>
                    <input type="time" id="dueTime" value={dueTime} onChange={(e) => setDueTime(e.target.value)} className={inputClass} required />
                 </div>
            </div>
            
            {/* Conditional Fields */}
            {type === ReminderType.DEBIT && (
                <div className="space-y-4 pt-4 border-t dark:border-gray-700 animate-fade-in">
                    <h3 className="font-semibold">{t('payment_details')}</h3>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="amount" className={labelClass}>{t('amount')} (₹)</label>
                            <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))} className={inputClass} placeholder="5000" />
                        </div>
                         <div>
                            <label htmlFor="paymentRecipientName" className={labelClass}>{t('recipient_name')}</label>
                            <input type="text" id="paymentRecipientName" value={paymentRecipientName} onChange={(e) => setPaymentRecipientName(e.target.value)} className={inputClass} placeholder={t('recipient_name_placeholder_payment')} />
                        </div>
                    </div>
                     <div>
                        <label className={labelClass}>{t('payment_method')}</label>
                         <div className="flex items-center gap-2 rounded-md bg-gray-100 dark:bg-gray-800 p-1">
                            <button type="button" onClick={() => setPaymentMode('upi')} className={`w-full py-1.5 rounded-md text-sm font-semibold transition-colors ${paymentMode === 'upi' ? 'bg-white dark:bg-gray-600 shadow text-primary dark:text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>{t('upi_id_link')}</button>
                            <button type="button" onClick={() => setPaymentMode('mobile')} className={`w-full py-1.5 rounded-md text-sm font-semibold transition-colors ${paymentMode === 'mobile' ? 'bg-white dark:bg-gray-600 shadow text-primary dark:text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>{t('mobile_number')}</button>
                        </div>
                    </div>
                    {paymentMode === 'upi' && (
                        <div className="animate-fade-in">
                            <label htmlFor="upiId" className={labelClass}>{t('upi_id')}</label>
                            <input type="text" id="upiId" value={upiId} onChange={(e) => setUpiId(e.target.value)} className={inputClass} placeholder={t('upi_id_placeholder')} />
                        </div>
                    )}
                    {paymentMode === 'mobile' && (
                        <div className="animate-fade-in">
                            <label htmlFor="mobileNumber" className={labelClass}>{t('mobile_number')}</label>
                            <div className="flex items-center gap-2">
                               <input type="tel" id="mobileNumber" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} className={inputClass} placeholder={t('phone_number_placeholder')} />
                               {isContactPickerSupported ? (
                                 <button 
                                    type="button" 
                                    onClick={() => handleSelectContact('payment-mobile')}
                                    disabled={isPickingContact}
                                    className="px-3 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 font-semibold flex items-center justify-center gap-2 transition-colors flex-shrink-0 min-w-[120px] disabled:opacity-70 disabled:cursor-wait"
                                 >
                                   {isPickingContact ? (
                                        <span className="italic text-sm">Loading...</span>
                                   ) : (
                                    <>
                                       <span>📞</span>
                                       <span className="hidden sm:inline">{t('select_contact')}</span>
                                    </>
                                   )}
                                 </button>
                               ) : (
                                <span className="text-xs text-gray-500 dark:text-gray-400 italic text-center flex-shrink-0">{t('contact_picker_not_supported')}</span>
                               )}
                            </div>
                        </div>
                    )}
                </div>
            )}
            
             {(type === ReminderType.CALL || type === ReminderType.WHATSAPP) && (
                <div className="space-y-4 pt-4 border-t dark:border-gray-700 animate-fade-in">
                    <h3 className="font-semibold">{type === ReminderType.CALL ? t('call_details') : t('whatsapp_details')}</h3>
                     <div>
                        <label htmlFor="contactName" className={labelClass}>{t('contact_name')}</label>
                        <input type="text" id="contactName" value={contactName} onChange={(e) => setContactName(e.target.value)} className={inputClass} placeholder={t('contact_name_placeholder')} />
                    </div>
                     <div>
                        <label htmlFor="contactPhone" className={labelClass}>{t('phone_number')}</label>
                        <div className="flex items-center gap-2">
                           <input type="tel" id="contactPhone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className={inputClass} placeholder={t('phone_number_placeholder')} />
                           {isContactPickerSupported ? (
                             <button 
                                type="button" 
                                onClick={() => handleSelectContact('call-contact')}
                                disabled={isPickingContact}
                                className="px-3 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 font-semibold flex items-center justify-center gap-2 transition-colors flex-shrink-0 min-w-[120px] disabled:opacity-70 disabled:cursor-wait"
                             >
                               {isPickingContact ? (
                                    <span className="italic text-sm">Loading...</span>
                               ) : (
                                <>
                                   <span>📞</span>
                                   <span className="hidden sm:inline">{t('select_contact')}</span>
                                </>
                               )}
                             </button>
                           ) : (
                             <span className="text-xs text-gray-500 dark:text-gray-400 italic text-center flex-shrink-0">{t('contact_picker_not_supported')}</span>
                           )}
                        </div>
                    </div>
                </div>
            )}


        </div>
        
        <div className="p-4 bg-gray-50 dark:bg-black/20 border-t dark:border-gray-700 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-semibold dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500">{t('cancel')}</button>
          <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 font-semibold dark:bg-primary-dark dark:text-on-primary dark:hover:bg-blue-500">{t('save_reminder')}</button>
        </div>
      </form>
    </div>
  );
};