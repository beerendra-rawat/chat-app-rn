import { useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus } from "react-native";
import { Timestamp } from "firebase/firestore";
import { presenceService } from "../services/presence.service";
import { lastTime } from "../utils/lastTime";
import { useAppSelector } from "../redux/store/hooks";

const HEARTBEAT_INTERVAL_MS = 25_000; // write "I'm alive" every 25s
const STALE_THRESHOLD_MS = 60_000; // if last heartbeat > 60s old, treat as offline
const LABEL_REFRESH_INTERVAL_MS = 30_000; // recompute "Xm ago" text every 30s

// ✅ Publishes the CURRENT user's presence — heartbeat while app is foregrounded
export function usePresenceHeartbeat() {
  const currentUid = useAppSelector((state) => state.auth.user?.uid);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const uidRef = useRef<string | undefined>(currentUid); // ✅ always holds the latest uid

  useEffect(() => {
    uidRef.current = currentUid;
  }, [currentUid]);

  useEffect(() => {
    if (!currentUid) return;

    let isActive = true; // ✅ guards against firing after cleanup/logout

    const startHeartbeat = () => {
      if (!isActive || !uidRef.current) return;
      presenceService.setOnline(uidRef.current); // immediate write

      intervalRef.current = setInterval(() => {
        if (!isActive || !uidRef.current) return; // ✅ skip if logged out mid-interval
        presenceService.setOnline(uidRef.current);
      }, HEARTBEAT_INTERVAL_MS);
    };

    const stopHeartbeat = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (uidRef.current) {
        presenceService.setOffline(uidRef.current); // best-effort — won't fire on force-kill
      }
    };

    startHeartbeat();

    const handleAppStateChange = (status: AppStateStatus) => {
      if (status === "active") {
        startHeartbeat();
      } else {
        stopHeartbeat();
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    return () => {
      isActive = false; // ✅ stops any in-flight interval callback from firing again
      subscription.remove();
      stopHeartbeat();
    };
  }, [currentUid]);
}

// ✅ Subscribes to ANOTHER user's presence with staleness detection + live-ticking label
export function usePresence(uid: string) {
  const [rawLastSeen, setRawLastSeen] = useState<Timestamp | null>(null);
  const [reportedOnline, setReportedOnline] = useState(false);
  const [label, setLabel] = useState("Offline");

  useEffect(() => {
    if (!uid) return;

    const unsubscribe = presenceService.subscribeToPresence(uid, (data) => {
      setReportedOnline(data.isOnline);
      setRawLastSeen(data.lastSeen);
    });

    return unsubscribe;
  }, [uid]);

  useEffect(() => {
    const recompute = () => {
      const lastSeenMillis = rawLastSeen ? rawLastSeen.toMillis() : null;
      const isStale =
        lastSeenMillis !== null &&
        Date.now() - lastSeenMillis > STALE_THRESHOLD_MS;

      const effectiveOnline = reportedOnline && !isStale;

      if (effectiveOnline) {
        setLabel("");
      } else {
        const formatted = lastTime(rawLastSeen);
        setLabel(formatted || "Offline");
      }
    };

    recompute();
    const interval = setInterval(recompute, LABEL_REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [rawLastSeen, reportedOnline]);

  const lastSeenMillis = rawLastSeen ? rawLastSeen.toMillis() : null;
  const isStale =
    lastSeenMillis !== null && Date.now() - lastSeenMillis > STALE_THRESHOLD_MS;
  const isOnline = reportedOnline && !isStale;

  return { isOnline, lastSeenLabel: label };
}
