import { useState, useCallback, useMemo } from 'react';
import { Notification, Reminder } from '../types';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((reminder: Reminder) => {
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      reminderId: reminder.id,
      title: reminder.title,
      type: reminder.type,
      timestamp: Date.now(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => 
      prev.map(n => n.read ? n : { ...n, read: true })
    );
  }, []);

  const clearNotifications = useCallback(() => {
    if(window.confirm('Are you sure you want to clear all notifications?')) {
        setNotifications([]);
    }
  }, []);

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  return {
    notifications,
    unreadCount,
    actions: {
      addNotification,
      markAllAsRead,
      clearNotifications,
    },
  };
};
