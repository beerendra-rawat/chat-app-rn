import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FriendsState {
  friends: string[];
  sentRequests: string[];
  receivedRequests: string[];
  loading: boolean;
}

const initialState: FriendsState = {
  friends: [],
  sentRequests: [],
  receivedRequests: [],
  loading: false,
};

const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    // ✅ Bulk setters — used by the Firestore real-time listener to sync full arrays
    setFriends: (state, action: PayloadAction<string[]>) => {
      state.friends = action.payload;
    },
    setSentRequests: (state, action: PayloadAction<string[]>) => {
      state.sentRequests = action.payload;
    },
    setReceivedRequests: (state, action: PayloadAction<string[]>) => {
      state.receivedRequests = action.payload;
    },

    // ✅ Sent requests (People screen: Add Friend -> Cancel)
    addSentRequest: (state, action: PayloadAction<string>) => {
      if (!state.sentRequests.includes(action.payload)) {
        state.sentRequests.push(action.payload);
      }
    },
    removeSentRequest: (state, action: PayloadAction<string>) => {
      state.sentRequests = state.sentRequests.filter(
        (uid) => uid !== action.payload,
      );
    },

    // ✅ Received requests (Friends screen: Accept/Delete)
    addReceivedRequest: (state, action: PayloadAction<string>) => {
      if (!state.receivedRequests.includes(action.payload)) {
        state.receivedRequests.push(action.payload);
      }
    },
    removeReceivedRequest: (state, action: PayloadAction<string>) => {
      state.receivedRequests = state.receivedRequests.filter(
        (uid) => uid !== action.payload,
      );
    },

    // ✅ Friends list
    addFriend: (state, action: PayloadAction<string>) => {
      if (!state.friends.includes(action.payload)) {
        state.friends.push(action.payload);
      }
    },
    removeFriendId: (state, action: PayloadAction<string>) => {
      state.friends = state.friends.filter((uid) => uid !== action.payload);
    },

    setFriendsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // ✅ Clear everything on logout
    resetFriendsState: () => initialState,
  },
});

export const {
  setFriends,
  setSentRequests,
  setReceivedRequests,
  addSentRequest,
  removeSentRequest,
  addReceivedRequest,
  removeReceivedRequest,
  addFriend,
  removeFriendId,
  setFriendsLoading,
  resetFriendsState,
} = friendsSlice.actions;

export default friendsSlice.reducer;
