import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { AddReminderModal } from './components/AddReminderModal';
import { SettingsModal } from './components/SettingsModal';
import { ProfileModal } from './components/ProfileModal';
import { NotificationPanel } from './components/NotificationPanel';
import { VirtualizedReminderGrid } from './components/VirtualizedReminderGrid';
import { NotificationModal } from './components/NotificationModal';
import { ToastNotification } from './components/ToastNotification';
import { ConfirmActionModal } from './components/ConfirmActionModal';
import { AboutModal } from './components/AboutModal';
import { WebViewWrapper } from './components/WebViewWrapper';
import { ConfirmationToast } from './components/ConfirmationToast';

import { useUser } from './hooks/useUser';
import { useSettings } from './hooks/useSettings';
import { useReminders } from './hooks/useReminders';
import { useNotifications } from './hooks/useNotifications';
import { useTranslation } from './hooks/useTranslation';
import { useReminderAlertSound } from './hooks/useReminderAlertSound';

import { Reminder, ReminderStatus } from './types';
import { PlusIcon } from './components/icons/PlusIcon';
import { SortAscIcon } from './components/icons/SortAscIcon';
import { SortDescIcon } from './components/icons/SortDescIcon';
import { SearchIcon } from './components/icons/SearchIcon';

type ModalType = 'ADD' | 'SETTINGS' | 'PROFILE' | 'NOTIFICATIONS' | 'ABOUT' | 'WEBVIEW' | null;
type SortDirection = 'ASC' | 'DESC';

function App() {
  // --- STATE AND HOOKS ---
  const { user, actions: userActions } = useUser();
  const { settings, actions: settingsActions } = useSettings();
  const { reminders, actions: reminderActions } = useReminders();
  const { notifications, unreadCount, actions: notificationActions } = useNotifications();
  const { t } = useTranslation(settings.language);

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  
  const [dueReminderForAlert, setDueReminderForAlert] = useState<Reminder | null>(null);
  const [dueReminderForToast, setDueReminderForToast] = useState<Reminder | null>(null);
  const [triggeredReminders, setTriggeredReminders] = useState<Set<string>>(new Set());
  const [hasInteracted, setHasInteracted] = useState(false);

  const [filterStatus, setFilterStatus] = useState<ReminderStatus | 'ALL'>('ALL');
  const [sortDirection, setSortDirection] = useState<SortDirection>('ASC');
  const [searchQuery, setSearchQuery] = useState('');

  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; reminderId: string | null }>({ isOpen: false, reminderId: null });
  const [confirmationToast, setConfirmationToast] = useState<string | null>(null);
  const [webView, setWebView] = useState<{ url: string; title: string; } | null>(null);

  // --- DERIVED STATE ---
  const filteredAndSortedReminders = useMemo(() => {
    const lowercasedQuery = searchQuery.toLowerCase().trim();
    return reminders
      .filter(r => {
          // Status filter
          const statusMatch = filterStatus === 'ALL' || r.status === filterStatus;
          if (!statusMatch) return false;

          // Search filter
          if (lowercasedQuery === '') return true;
          const titleMatch = r.title.toLowerCase().includes(lowercasedQuery);
          const descriptionMatch = r.description?.toLowerCase().includes(lowercasedQuery) ?? false;
          return titleMatch || descriptionMatch;
      })
      .sort((a, b) => {
        if (sortDirection === 'ASC') {
          return a.due_timestamp - b.due_timestamp;
        }
        return b.due_timestamp - a.due_timestamp;
      });
  }, [reminders, filterStatus, sortDirection, searchQuery]);
  
  // --- EFFECTS ---

  // User interaction listener to enable audio
  useEffect(() => {
    const listener = () => setHasInteracted(true);
    window.addEventListener('click', listener, { once: true });
    window.addEventListener('keydown', listener, { once: true });
    return () => {
      window.removeEventListener('click', listener);
      window.removeEventListener('keydown', listener);
    };
  }, []);

  // Reminder check interval
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const dueReminders = reminders.filter(r => 
        r.status === ReminderStatus.ACTIVE &&
        r.due_timestamp <= now &&
        !triggeredReminders.has(r.id)
      );

      dueReminders.forEach(reminder => {
        notificationActions.addNotification(reminder);
        if (settings.notifications.highAlert) {
          setDueReminderForAlert(prev => prev ?? reminder); // Show first one
        } else {
          setDueReminderForToast(reminder);
        }
        // Fix: Use 'reminder' from the forEach loop instead of 'r' which is not defined in this scope.
        setTriggeredReminders(prev => new Set(prev).add(reminder.id));
      });
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [reminders, triggeredReminders, settings.notifications.highAlert, notificationActions]);
  
  // Sound alert hook
  useReminderAlertSound(dueReminderForAlert, settings.notifications.ringtone, hasInteracted && settings.notifications.sound_alert);


  // --- HANDLERS ---
  const showToast = (messageKey: string) => {
    setConfirmationToast(t(messageKey));
  };
  
  const handleSaveReminder = (reminderData: Omit<Reminder, 'id' | 'user_id' | 'status'>) => {
    reminderActions.add(reminderData);
    setActiveModal(null);
    showToast('reminder_added');
  };

  const handleUpdateStatus = (id: string, status: ReminderStatus) => {
    reminderActions.updateStatus(id, status);
    if (dueReminderForAlert?.id === id) setDueReminderForAlert(null);
    showToast('reminder_updated');
  };
  
  const handleDelete = (id: string) => {
    // If the notification modal is open for this reminder, close it before showing the confirmation
    if (dueReminderForAlert?.id === id) {
        setDueReminderForAlert(null);
    }
    setDeleteConfirmation({ isOpen: true, reminderId: id });
  };
  
  const confirmDelete = () => {
    if (deleteConfirmation.reminderId) {
      reminderActions.delete(deleteConfirmation.reminderId);
      if (dueReminderForAlert?.id === deleteConfirmation.reminderId) setDueReminderForAlert(null);
      showToast('reminder_deleted');
    }
    setDeleteConfirmation({ isOpen: false, reminderId: null });
  };

  const handleSnooze = (id: string) => {
    reminderActions.snooze(id, settings.snooze_duration);
    if (dueReminderForAlert?.id === id) setDueReminderForAlert(null);
    // Allow reminder to be triggered again
    setTriggeredReminders(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
    });
    showToast(`${t('snoozed_for')} ${settings.snooze_duration} ${t('minutes')}`);
  };
  
  const handleSaveSettings = (updatedSettings: Partial<typeof settings>) => {
    settingsActions.update(updatedSettings);
    showToast('settings_saved');
  };

  const handleSaveProfile = (updatedUser: Partial<typeof user>) => {
    userActions.updateUser(updatedUser);
    showToast('profile_updated');
  };

  const handleShowAbout = () => {
      setActiveModal('ABOUT');
  };

  const handleShowWebView = (url: string, titleKey: string) => {
      setWebView({ url, title: t(titleKey) });
      setActiveModal('WEBVIEW');
  };

  const handleCloseWebView = () => {
      setWebView(null);
      setActiveModal('ABOUT'); // Go back to about modal
  }

  const handleToggleNotifications = useCallback(() => {
    setShowNotificationPanel(prev => !prev);
    if (!showNotificationPanel) {
      notificationActions.markAllAsRead();
    }
  }, [showNotificationPanel, notificationActions]);
  
  // --- RENDER ---
  return (
    <div className="bg-background dark:bg-background-dark min-h-screen text-on-background dark:text-on-background-dark font-sans transition-colors duration-300">
      <Header
        user={user}
        unreadCount={unreadCount}
        onShowNotifications={handleToggleNotifications}
        onShowSettings={() => setActiveModal('SETTINGS')}
        onShowProfile={() => setActiveModal('PROFILE')}
        t={t}
      />
      
      {showNotificationPanel && (
          <NotificationPanel 
            notifications={notifications}
            onClearAll={notificationActions.clearNotifications}
            onClose={() => setShowNotificationPanel(false)}
            t={t}
          />
      )}

      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold">{t('all_reminders')}</h2>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                <div className="relative w-full sm:w-auto">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <SearchIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder={t('search_placeholder')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-1.5 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div className="flex items-center gap-2">
                  <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)} className="bg-surface dark:bg-surface-dark border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="ALL">{t('all')}</option>
                    <option value={ReminderStatus.ACTIVE}>{t('active')}</option>
                    <option value={ReminderStatus.COMPLETED}>{t('completed')}</option>
                  </select>
                  <button onClick={() => setSortDirection(p => p === 'ASC' ? 'DESC' : 'ASC')} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    {sortDirection === 'ASC' ? <SortAscIcon className="w-5 h-5" /> : <SortDescIcon className="w-5 h-5" />}
                  </button>
                </div>
            </div>
        </div>

        <VirtualizedReminderGrid
          reminders={filteredAndSortedReminders}
          onUpdateStatus={handleUpdateStatus}
          onSnooze={handleSnooze}
          onDelete={handleDelete}
          onAdd={() => setActiveModal('ADD')}
          t={t}
        />
      </main>

      <button
        onClick={() => setActiveModal('ADD')}
        className="fixed bottom-6 right-6 bg-primary dark:bg-primary-dark text-white rounded-full p-4 shadow-lg hover:bg-blue-700 dark:hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition-transform transform hover:scale-110"
        aria-label={t('add_reminder')}
      >
        <PlusIcon className="w-7 h-7" />
      </button>

      {/* Modals & Toasts */}
      {activeModal === 'ADD' && <AddReminderModal onClose={() => setActiveModal(null)} onSave={handleSaveReminder} t={t} />}
      {activeModal === 'SETTINGS' && <SettingsModal settings={settings} onClose={() => setActiveModal(null)} onSave={handleSaveSettings} onShowAbout={handleShowAbout} t={t} />}
      {activeModal === 'PROFILE' && <ProfileModal user={user} onClose={() => setActiveModal(null)} onSave={handleSaveProfile} t={t} />}
      {activeModal === 'ABOUT' && <AboutModal onClose={() => setActiveModal(null)} onShowWebView={handleShowWebView} t={t} />}
      {activeModal === 'WEBVIEW' && webView && <WebViewWrapper url={webView.url} title={webView.title} onClose={handleCloseWebView} />}
      
      {dueReminderForAlert && <NotificationModal reminder={dueReminderForAlert} onSnooze={handleSnooze} onComplete={(id) => handleUpdateStatus(id, ReminderStatus.COMPLETED)} onDelete={handleDelete} t={t} />}
      {dueReminderForToast && <ToastNotification reminder={dueReminderForToast} onDismiss={() => setDueReminderForToast(null)} />}
      
      <ConfirmActionModal 
        isOpen={deleteConfirmation.isOpen}
        title={t('delete_confirmation_title')}
        message={t('delete_confirmation_message')}
        confirmText={t('delete_confirm')}
        cancelText={t('cancel')}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirmation({ isOpen: false, reminderId: null })}
      />
      
      {confirmationToast && <ConfirmationToast message={confirmationToast} onClose={() => setConfirmationToast(null)} />}
    </div>
  );
}

export default App;