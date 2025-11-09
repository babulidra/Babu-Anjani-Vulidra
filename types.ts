// Fix: Refactor to define and export all application types, removing circular dependencies and mock data.
export enum Language {
    EN = 'en',
    HI = 'hi',
    MR = 'mr',
    GU = 'gu',
    TA = 'ta',
    TE = 'te',
    KN = 'kn',
    ML = 'ml',
    PA = 'pa',
    BN = 'bn',
    OR = 'or',
    AS = 'as',
    UR = 'ur',
    SA = 'sa',
}

export interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
}

export enum ReminderType {
  DEBIT = 'DEBIT',
  CALL = 'CALL',
  TASK = 'TASK',
  WHATSAPP = 'WHATSAPP',
}

export enum ReminderStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

export interface Reminder {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  type: ReminderType;
  due_timestamp: number;
  status: ReminderStatus;
  amount?: number;
  recipient_name?: string;
  upi_id?: string;
  phone?: string;
  payment_mode?: 'upi' | 'mobile';
  mobile_number?: string;
}

export interface Ringtone {
  name: string;
  url: string;
}

export interface Settings {
  theme: 'light' | 'dark' | 'system';
  language: Language;
  snooze_duration: number;
  notifications: {
    sound_alert: boolean;
    highAlert: boolean;
    ringtone: string;
  };
  custom_ringtones: Ringtone[];
}

export interface Notification {
  id: string;
  reminderId: string;
  title: string;
  type: ReminderType;
  timestamp: number;
  read: boolean;
}