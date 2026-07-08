import { db } from "../config/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  doc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";
import { Story } from "../types/story";

const STORY_TTL_MS = 24 * 60 * 60 * 1000; // 24h, like Instagram

export const storyService = {
  async addStory(
    userId: string,
    userName: string,
    userAvatar: string | null | undefined,
    mediaUrl: string,
  ) {
    const storiesRef = collection(db, "stories");
    const now = Date.now();
    await addDoc(storiesRef, {
      userId,
      userName,
      userAvatar: userAvatar ?? null,
      mediaUrl,
      createdAt: serverTimestamp(),
      clientCreatedAt: now,
      expiresAt: now + STORY_TTL_MS,
      viewers: [],
    });
  },

  // subscribes to active stories for a set of user ids (self + friends)
  subscribeToStories(userIds: string[], callback: (stories: Story[]) => void) {
    // ✅ new — belt-and-suspenders guard at the service boundary too,
    // in case a caller other than useStories ever passes a dirty array
    const validIds = userIds.filter(
      (id): id is string => typeof id === "string" && id.length > 0,
    );

    if (!validIds.length) {
      callback([]);
      return () => {};
    }

    const storiesRef = collection(db, "stories");
    // ✅ single-field filter only — avoids needing a composite index
    const q = query(storiesRef, where("userId", "in", validIds.slice(0, 30)));

    return onSnapshot(
      q,
      (snapshot) => {
        const now = Date.now();
        const stories: Story[] = snapshot.docs
          .map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              userId: data.userId,
              userName: data.userName,
              userAvatar: data.userAvatar,
              mediaUrl: data.mediaUrl,
              createdAt: data.createdAt
                ? (data.createdAt as Timestamp).toMillis()
                : data.clientCreatedAt,
              expiresAt: data.expiresAt,
              viewers: data.viewers ?? [],
            } as Story;
          })
          // ✅ expired stories filtered client-side
          .filter((s) => s.expiresAt > now)
          // ✅ oldest → newest so the viewer plays them in order
          .sort((a, b) => a.createdAt - b.createdAt);

        callback(stories);
      },
      (err) => {
        // ✅ new — surfaces permission/query errors instead of an uncaught crash
        console.error("Failed to subscribe to stories:", err);
        callback([]);
      },
    );
  },

  async markStoryViewed(storyId: string, viewerUid: string) {
    await updateDoc(doc(db, "stories", storyId), {
      viewers: arrayUnion(viewerUid),
    });
  },

  async deleteStory(storyId: string) {
    await deleteDoc(doc(db, "stories", storyId));
  },
};
