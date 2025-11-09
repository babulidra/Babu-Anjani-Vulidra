import { useState, useCallback } from 'react';
import { Reminder, ReminderStatus } from '../types';
import { MOCK_REMINDERS } from '../constants';

export const useReminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>(MOCK_REMINDERS);

  const addReminder = useCallback((newReminderData: Omit<Reminder, 'id' | 'user_id' | 'status'>) => {
    const newReminder: Reminder = {
      ...newReminderData,
      id: `rem-${Date.now()}`,
      user_id: 'user-123', // Assuming a mock user
      status: ReminderStatus.ACTIVE,
    };
    setReminders((prev) => [newReminder, ...prev]);
  }, []);

  const updateStatus = useCallback((id: string, status: ReminderStatus) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  }, []);

  const deleteReminder = useCallback((id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const snoozeReminder = useCallback((id: string, snoozeDurationMinutes: number) => {
    setReminders((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, due_timestamp: Date.now() + snoozeDurationMinutes * 60 * 1000 }
          : r
      )
    );
  }, []);

  return {
    reminders,
    actions: {
      add: addReminder,
      updateStatus,
      delete: deleteReminder,
      snooze: snoozeReminder,
    },
  };
};
