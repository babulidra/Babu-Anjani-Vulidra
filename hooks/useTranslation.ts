import { useCallback } from 'react';
import { Language } from '../types';

const translations: Record<Language, Record<string, string>> = {
  [Language.EN]: {
    header_title: 'Remind Me',
    all_reminders: 'All Reminders',
    search_placeholder: 'Search reminders...',
    all: 'All',
    active: 'Active',
    completed: 'Completed',
    add_reminder: 'Add Reminder',
    new_reminder: 'New Reminder',
    reminder_added: 'Reminder added successfully!',
    reminder_updated: 'Reminder updated!',
    reminder_deleted: 'Reminder permanently deleted.',
    snoozed_for: 'Snoozed for',
    minutes: 'minutes',
    settings_saved: 'Settings saved!',
    profile_updated: 'Profile updated!',
    delete_confirmation_title: 'Confirm Deletion',
    delete_confirmation_message: 'Are you sure you want to delete this reminder? This action cannot be undone.',
    delete_confirm: 'Delete',
    cancel: 'Cancel',
    overdue_by: 'Overdue by',
    due_in: 'Due in',
    mark_complete: 'Mark as Complete',
    snooze: 'Snooze',
    delete: 'Delete',
    delete_reminder: 'Delete Reminder',
    delete_reminder_aria: 'Delete this reminder permanently',
    type: 'Type',
    task: 'Task',
    payment: 'Payment',
    call: 'Call',
    whatsapp: 'WhatsApp',
    title: 'Title',
    description: 'Description',
    due_date: 'Due Date',
    due_time: 'Due Time',
    payment_details: 'Payment Details',
    amount: 'Amount',
    recipient_name: 'Recipient Name',
    recipient_name_placeholder_payment: 'e.g., Electricity Board',
    upi_id: 'UPI ID',
    upi_id_placeholder: 'e.g., user@okhdfcbank',
    call_details: 'Call Details',
    whatsapp_details: 'WhatsApp Details',
    contact_name: 'Contact Name',
    contact_name_placeholder: 'e.g., Mom',
    phone_number: 'Phone Number',
    phone_number_placeholder: 'e.g., +91 98765 43210',
    select_contact: 'Contact',
    save_reminder: 'Save Reminder',
    settings: 'Settings',
    about_app: 'About App',
    notifications: 'Notifications',
    no_new_notifications: 'No new notifications.',
    clear_all_notifications: 'Clear All Notifications',
    profile: 'Profile',
    privacy_policy: 'Privacy Policy',
    terms_conditions: 'Terms & Conditions',
    contact_support: 'Contact Support',
    app_version: 'App Version',
    payment_method: 'Payment Method',
    upi_id_link: 'UPI ID / Link',
    mobile_number: 'Mobile Number',
    pay_now: 'Pay Now',
    pay_to: 'Pay to',
    send_whatsapp: 'Send WhatsApp',
    contact_picker_not_supported: 'Contact picker not supported',
  },
  // Other language translations would go here.
  // For now, they are empty and will fall back to English.
  [Language.HI]: {},
  [Language.MR]: {},
  [Language.GU]: {},
  [Language.TA]: {},
  [Language.TE]: {},
  [Language.KN]: {},
  [Language.ML]: {},
  [Language.PA]: {},
  [Language.BN]: {},
  [Language.OR]: {},
  [Language.AS]: {},
  [Language.UR]: {},
  [Language.SA]: {},
};

export const useTranslation = (language: Language) => {
  const t = useCallback(
    (key: string): string => {
      const langDict = translations[language] || translations[Language.EN];
      const translation = langDict[key];
      // Fallback to English if translation is missing in the current language
      return translation || translations[Language.EN][key] || key;
    },
    [language]
  );

  return { t };
};