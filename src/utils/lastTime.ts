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

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`; // ✅ fixed — pluralizes correctly

  const months = Math.floor(days / 30);
  if (months < 12) return months === 1 ? "1 month ago" : `${months} months ago`; // ✅ new

  const years = Math.floor(days / 365);
  return years === 1 ? "1 year ago" : `${years} years ago`; // ✅ new
};

// ✅ new — groups a list of items into section labels: Today, Yesterday,
// This Week, X weeks/months/years ago. Used for SectionList headers.
export function getDateGroupLabel(timestamp: number): string {
  const now = new Date();
  const date = new Date(timestamp);

  const startOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const diffDays = Math.round(
    (startOfDay(now).getTime() - startOfDay(date).getTime()) /
      (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays > 1 && diffDays < 7) return "This Week";

  if (diffDays >= 7 && diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  }

  if (diffDays >= 30 && diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return months === 1 ? "1 month ago" : `${months} months ago`;
  }

  const years = Math.floor(diffDays / 365);
  return years === 1 ? "1 year ago" : `${years} years ago`;
}

export function groupByDateLabel<T>(
  items: T[],
  getTimestamp: (item: T) => number,
): { title: string; data: T[] }[] {
  const order: string[] = [];
  const map = new Map<string, T[]>();

  items.forEach((item) => {
    const label = getDateGroupLabel(getTimestamp(item));
    if (!map.has(label)) {
      map.set(label, []);
      order.push(label);
    }
    map.get(label)!.push(item);
  });

  return order.map((title) => ({ title, data: map.get(title)! }));
}
