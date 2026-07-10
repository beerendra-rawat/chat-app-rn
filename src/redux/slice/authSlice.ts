import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "firebase/auth";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, { payload }: PayloadAction<User | null>) => {
      console.log("✅ Redux | User Updated");
      if (payload) {
        console.log("👤 UID:", payload.uid);
        console.log("📧 Email:", payload.email);
      } else {
        console.log("🚪 User session cleared");
      }
      state.user = payload;
      state.loading = false;
      state.error = null;
    },

    setLoading: (state, { payload }: PayloadAction<boolean>) => {
      console.log(`⏳ Redux | Loading: ${payload}`);
      state.loading = payload;
      if (payload) state.error = null;
    },

    setError: (state, { payload }: PayloadAction<string>) => {
      console.log("❌ Redux | Auth Error");
      console.log("Reason:", payload);
      state.error = payload;
      state.loading = false;
    },

    logout: (state) => {
      console.log("🚪 Redux | User Logged Out");
      Object.assign(state, initialState);
    },
  },
});

export const { setUser, setLoading, setError, logout } = authSlice.actions;
export default authSlice.reducer;
