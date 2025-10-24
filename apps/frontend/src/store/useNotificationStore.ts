import { create } from 'zustand';
import toast from 'react-hot-toast';
import api from '../utils/axiosClient';

interface Notification {
  id: string;
  userId: string;
  tenantId: string;
  title: string;
  message: string;
  type: string;
  category?: string;
  entityType?: string;
  entityId?: string;
  isRead: boolean;
  readAt?: string;
  actionUrl?: string;
  createdAt: string;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  pollingInterval: NodeJS.Timeout | null;
  isPolling: boolean;
  isLoading: boolean;
  lastNotificationId: string | null;
  hasFetchedOnce: boolean;
  
  // Actions
  startPolling: () => void;
  stopPolling: () => void;
  fetchNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  addNotification: (notification: Notification) => void;
}

const POLLING_INTERVAL = 30000; // 30 seconds

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  pollingInterval: null,
  isPolling: false,
  isLoading: false,
  lastNotificationId: null,
  hasFetchedOnce: false,

  startPolling: () => {
    const { pollingInterval, isPolling } = get();
    
    // Don't start if already polling
    if (isPolling || pollingInterval) {
      console.log('[HTTP Polling] Already polling');
      return;
    }

    console.log('[HTTP Polling] Starting notification polling (30s interval - optimized)');
    
    // Fetch immediately using combined endpoint
    get().fetchNotifications();
    
    // Set up polling interval with combined endpoint
    const interval = setInterval(() => {
      get().fetchNotifications();
    }, POLLING_INTERVAL);
    
    set({ pollingInterval: interval, isPolling: true });
  },

  stopPolling: () => {
    const { pollingInterval } = get();
    
    if (pollingInterval) {
      clearInterval(pollingInterval);
      set({ pollingInterval: null, isPolling: false });
      console.log('[HTTP Polling] Stopped polling');
    }
  },

  fetchNotifications: async () => {
    try {
      set({ isLoading: true });
      // Use optimized combined endpoint that returns both notifications and count
      const { data } = await api.get('/notifications/with-count', { params: { limit: 50 } });
      
      const notifications = data.notifications || [];
      const unreadCount = data.unreadCount || 0;
      
      const { lastNotificationId, hasFetchedOnce } = get();
      
      // Check for new notifications (skip toasts on initial load)
      if (notifications.length > 0 && hasFetchedOnce) {
        let newNotifications: Notification[] = [];
        
        if (lastNotificationId === null) {
          // First poll after empty inbox - show toasts for all unread notifications
          newNotifications = notifications.filter((n: Notification) => !n.isRead);
        } else if (notifications[0].id !== lastNotificationId) {
          // Subsequent polls - find new notifications since last poll
          for (const notification of notifications) {
            if (notification.id === lastNotificationId) break;
            newNotifications.push(notification);
          }
          // Only show toasts for unread notifications
          newNotifications = newNotifications.filter((n: Notification) => !n.isRead);
        }
        
        // Show toast for new unread notifications
        newNotifications.reverse().forEach((notification: Notification) => {
          const typeMap: Record<string, any> = {
            success: () => toast.success(notification.title),
            error: () => toast.error(notification.title),
            warning: () => toast(notification.title, { icon: '⚠️' }),
            info: () => toast(notification.title, { icon: 'ℹ️' }),
          };
          
          const showToast = typeMap[notification.type] || typeMap.info;
          showToast();
        });
      }
      
      // Update state with both notifications and unread count
      set({ 
        notifications, 
        unreadCount,
        isLoading: false,
        lastNotificationId: notifications.length > 0 ? notifications[0].id : null,
        hasFetchedOnce: true
      });
    } catch (error) {
      console.error('[Notifications] Failed to fetch notifications:', error);
      set({ isLoading: false });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const { data } = await api.get('/notifications/unread-count');
      set({ unreadCount: data.count });
    } catch (error) {
      console.error('[Notifications] Failed to fetch unread count:', error);
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === notificationId ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error) {
      console.error('[Notifications] Failed to mark as read:', error);
    }
  },

  markAllAsRead: async () => {
    try {
      await api.put('/notifications/mark-all-read');
      
      set((state) => ({
        notifications: state.notifications.map((n) => ({
          ...n,
          isRead: true,
          readAt: new Date().toISOString(),
        })),
        unreadCount: 0,
      }));
    } catch (error) {
      console.error('[Notifications] Failed to mark all as read:', error);
    }
  },

  deleteNotification: async (notificationId: string) => {
    try {
      await api.delete(`/notifications/${notificationId}`);
      
      set((state) => {
        const notification = state.notifications.find((n) => n.id === notificationId);
        const wasUnread = notification && !notification.isRead;
        
        return {
          notifications: state.notifications.filter((n) => n.id !== notificationId),
          unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
        };
      });
    } catch (error) {
      console.error('[Notifications] Failed to delete notification:', error);
    }
  },

  addNotification: (notification: Notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
    }));
  },
}));
