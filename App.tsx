import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import messaging from "@react-native-firebase/messaging"; // ✅ new
import RootNavigator from "./src/navigation/RootNavigator";
import { store } from "./src/redux/store/store";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useFriendsSync } from "./src/hooks/useFriendsSync";
import { usePresenceHeartbeat } from "./src/hooks/usePresence";
import { usePushNotifications } from "./src/hooks/usePushNotifications"; // ✅ new
import { useAppSelector } from "./src/redux/store/hooks"; // ✅ new

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
    },
  },
});

// ✅ Must live inside <Provider> to use Redux hooks
function AppInner() {
  const currentUid = useAppSelector((state) => state.auth.user?.uid); // ✅ new

  useFriendsSync(); // keeps friends/sentRequests/receivedRequests live app-wide
  usePresenceHeartbeat();

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {/* ✅ new — usePushNotifications needs navigation context, so it
            must be called from a component rendered INSIDE
            NavigationContainer, not from AppInner itself */}
        <PushNotificationBridge uid={currentUid} />
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

// ✅ new — small bridge component purely so usePushNotifications (which
// calls useNavigation internally) has access to navigation context.
// Renders nothing; exists only to run the hook at the right place in the tree.
function PushNotificationBridge({ uid }: { uid?: string }) {
  usePushNotifications(uid);
  return null;
}

export default function App() {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "314645370562-q19hruee9tpgksfrkp0vsuj82r381po6.apps.googleusercontent.com",
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  }, []);

  // ✅ new — registers the background/killed-state message handler.
  // Technically this belongs in index.ts (it must run before the app
  // renders to reliably catch killed-state pushes), but registering it
  // again here is harmless — RNFirebase dedupes it — and keeps things
  // visible if you haven't set up index.ts yet. See note below.
  useEffect(() => {
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Background/killed-state message received:", remoteMessage);
    });
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppInner />
      </QueryClientProvider>
    </Provider>
  );
}
