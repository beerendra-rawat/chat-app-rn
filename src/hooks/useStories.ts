import { useEffect, useMemo, useState } from "react";
import { storyService } from "../services/story.service";
import { Story, UserStories } from "../types/story";

export function useStories(
  currentUid: string | undefined,
  friendIds: string[],
) {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  const idsKey = friendIds.join(",");

  const userIds = useMemo(() => {
    const ids = currentUid ? [currentUid, ...friendIds] : friendIds;
    // ✅ new — strips undefined/null/empty entries before they ever reach Firestore's where()
    return ids.filter(
      (id): id is string => typeof id === "string" && id.length > 0,
    );
  }, [currentUid, idsKey]);

  useEffect(() => {
    if (!userIds.length) {
      setStories([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsubscribe = storyService.subscribeToStories(userIds, (data) => {
      setStories(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [userIds.join(",")]);

  const storyGroups: UserStories[] = useMemo(() => {
    const map = new Map<string, UserStories>();

    stories.forEach((story) => {
      const isUnseen = !!currentUid && !story.viewers.includes(currentUid);
      const existing = map.get(story.userId);
      if (existing) {
        existing.stories.push(story);
        existing.hasUnseen = existing.hasUnseen || isUnseen;
      } else {
        map.set(story.userId, {
          userId: story.userId,
          userName: story.userName,
          userAvatar: story.userAvatar,
          stories: [story],
          hasUnseen: isUnseen,
        });
      }
    });

    const groups = Array.from(map.values());
    // ✅ your own story first, then unseen friends, then already-seen
    groups.sort((a, b) => {
      if (a.userId === currentUid) return -1;
      if (b.userId === currentUid) return 1;
      if (a.hasUnseen !== b.hasUnseen) return a.hasUnseen ? -1 : 1;
      return 0;
    });

    return groups;
  }, [stories, currentUid]);

  return { storyGroups, loading };
}
