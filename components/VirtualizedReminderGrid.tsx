import React from 'react';
import { Reminder, ReminderStatus } from '../types';
import { ReminderCard } from './ReminderCard';
import { PlusCircleIcon } from './icons/PlusCircleIcon';

interface VirtualizedReminderGridProps {
  reminders: Reminder[];
  onUpdateStatus: (id: string, status: ReminderStatus) => void;
  onSnooze: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  t: (key: string) => string;
}

export const VirtualizedReminderGrid: React.FC<VirtualizedReminderGridProps> = ({
  reminders,
  onUpdateStatus,
  onSnooze,
  onDelete,
  onAdd,
  t
}) => {
  if (reminders.length === 0) {
    return (
      <div className="text-center py-20 flex flex-col items-center">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">No reminders here!</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Ready to add your first one?</p>
        <button
          onClick={onAdd}
          className="mt-6 px-6 py-3 bg-primary text-white rounded-full font-semibold flex items-center gap-2 shadow-lg hover:bg-blue-700 dark:bg-primary-dark dark:hover:bg-blue-500 transition-transform transform hover:scale-105"
        >
          <PlusCircleIcon className="w-6 h-6" />
          {t('add_reminder')}
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 md:p-6">
      {reminders.map((reminder) => (
        <ReminderCard
          key={reminder.id}
          reminder={reminder}
          onUpdateStatus={onUpdateStatus}
          onSnooze={onSnooze}
          onDelete={onDelete}
          t={t}
        />
      ))}
    </div>
  );
};
