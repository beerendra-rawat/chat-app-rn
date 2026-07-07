import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import RootNavigator from "./src/navigation/RootNavigator";
import { store } from "./src/redux/store/store";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useFriendsSync } from "./src/hooks/useFriendsSync"; // ✅ new
import { usePresenceHeartbeat } from "./src/hooks/usePresence";

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
  useFriendsSync(); // ✅ keeps friends/sentRequests/receivedRequests live app-wide
  usePresenceHeartbeat()

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
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

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppInner />
      </QueryClientProvider>
    </Provider>
  );
}
