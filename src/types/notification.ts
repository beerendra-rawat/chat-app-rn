export type NotificationType =
  | "message"
  | "friend_request"
  | "friend_request_accepted";

export interface AppNotification {
  id: string;
  userId: string; // recipient
  type: NotificationType;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar?: string | null;
  message?: string; // preview text, only for type "message"
  chatId?: string; // only for type "message", used for navigation
  isRead: boolean;
  createdAt: number;
}
