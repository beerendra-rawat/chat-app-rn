import { useEffect, useMemo, useState } from "react";
import { chatService } from "../services/chat.service";
import { ChatSummary } from "../types/chat";

export function useRecentChats(currentUid?: string) {
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUid) {
      setChats([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsubscribe = chatService.subscribeToUserChats(currentUid, (data) => {
      setChats(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [currentUid]);

  const otherUserIds = useMemo(() => {
    if (!currentUid) return [];
    return chats
      .map((c) => c.participants.find((p) => p !== currentUid))
      .filter((id): id is string => !!id);
  }, [chats, currentUid]);

  return { chats, otherUserIds, loading };
}
