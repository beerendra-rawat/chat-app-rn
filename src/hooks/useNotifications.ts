import { useEffect, useState } from "react";
import { notificationService } from "../services/notification.service";
import { AppNotification } from "../types/notification";

export function useNotifications(uid?: string) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setNotifications([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsubscribe = notificationService.subscribeToUserNotifications(
      uid,
      (list) => {
        setNotifications(list);
        setLoading(false);
      },
    );
    return () => unsubscribe();
  }, [uid]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return { notifications, loading, unreadCount };
}
