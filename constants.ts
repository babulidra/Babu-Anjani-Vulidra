import { User, Reminder, Settings, ReminderStatus, ReminderType, Language, Ringtone } from './types';

// Fix: Provide full content for constants.ts
export const APP_VERSION = '1.0.0';

export const MOCK_USER: User = {
  uid: 'user-123',
  displayName: 'John Doe',
  email: 'john.doe@example.com',
  photoURL: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
};

export const MOCK_RINGTONES: Ringtone[] = [
    { name: 'None', url: 'NONE' },
    { name: 'Default Beep', url: 'https://cdn.jsdelivr.net/gh/k-f-group/remind-me-app-sounds/sounds/beep.mp3' },
    { name: 'Chime', url: 'https://cdn.jsdelivr.net/gh/k-f-group/remind-me-app-sounds/sounds/chime.mp3' },
    { name: 'Utopia', url: 'https://cdn.jsdelivr.net/gh/k-f-group/remind-me-app-sounds/sounds/utopia.mp3' },
];

export const MOCK_SETTINGS: Settings = {
  theme: 'system',
  language: Language.EN,
  snooze_duration: 5, // in minutes
  notifications: {
    sound_alert: true,
    highAlert: true,
    ringtone: MOCK_RINGTONES[1].url, // Default Beep
  },
  custom_ringtones: [],
};

export const MOCK_REMINDERS: Reminder[] = [
  {
    id: 'rem-1',
    user_id: 'user-123',
    title: 'Pay electricity bill',
    description: 'Due on the 15th of every month. Pay via UPI.',
    type: ReminderType.DEBIT,
    due_timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
    status: ReminderStatus.ACTIVE,
    amount: 1500,
    recipient_name: 'Power Company',
    upi_id: 'powerco@upi',
    payment_mode: 'upi',
  },
  {
    id: 'rem-2',
    user_id: 'user-123',
    title: 'Call Mom',
    description: 'Check in on her and see how she is doing.',
    type: ReminderType.CALL,
    due_timestamp: Date.now() + 1 * 60 * 60 * 1000, // in 1 hour
    status: ReminderStatus.ACTIVE,
    recipient_name: 'Mom',
    phone: '+91 98765 43210',
  },
  {
    id: 'rem-3',
    user_id: 'user_id: "user-123"',
    title: 'Finish project report',
    description: 'Final draft needs to be submitted by EOD.',
    type: ReminderType.TASK,
    due_timestamp: Date.now() + 4 * 60 * 60 * 1000, // in 4 hours
    status: ReminderStatus.ACTIVE,
  },
  {
    id: 'rem-4',
    user_id: 'user-123',
    title: 'Book flight tickets',
    description: 'For the vacation in December.',
    type: ReminderType.TASK,
    due_timestamp: Date.now() + 3 * 24 * 60 * 60 * 1000, // in 3 days
    status: ReminderStatus.ACTIVE,
  },
    {
    id: 'rem-5',
    user_id: 'user-123',
    title: 'Doctor\'s appointment',
    description: 'Annual check-up.',
    type: ReminderType.TASK,
    due_timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
    status: ReminderStatus.COMPLETED,
  },
  {
    id: 'rem-6',
    user_id: 'user-123',
    title: 'Pay Rent',
    description: 'Monthly rent to landlord via mobile number.',
    type: ReminderType.DEBIT,
    due_timestamp: Date.now() + 5 * 24 * 60 * 60 * 1000, // in 5 days
    status: ReminderStatus.ACTIVE,
    amount: 12000,
    recipient_name: 'Landlord',
    payment_mode: 'mobile',
    mobile_number: '9876543210',
  },
  {
    id: 'rem-7',
    user_id: 'user-123',
    title: 'WhatsApp Jane',
    description: 'Send update about the project proposal.',
    type: ReminderType.WHATSAPP,
    due_timestamp: Date.now() + 2 * 24 * 60 * 60 * 1000, // in 2 days
    status: ReminderStatus.ACTIVE,
    recipient_name: 'Jane Smith',
    phone: '+15551234567',
  },
];