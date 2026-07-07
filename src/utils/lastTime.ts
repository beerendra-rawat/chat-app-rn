import { Timestamp } from "firebase/firestore";

export const lastTime = (
  timestamp: Timestamp | number | null | undefined,
): string => {
  if (!timestamp) return "";

  const date =
    typeof timestamp === "number" ? new Date(timestamp) : timestamp.toDate();
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;

  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;

  return `${Math.floor(days / 7)} week ago`;
};
