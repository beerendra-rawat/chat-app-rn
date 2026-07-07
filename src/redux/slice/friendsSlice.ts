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
    setFriends: (state, action: PayloadAction<string[]>) => {
      state.friends = action.payload;
    },
    addSentRequest: (state, action: PayloadAction<string>) => {
      state.sentRequests.push(action.payload);
    },
    // ... more actions
  },
});

export const { setFriends, addSentRequest } = friendsSlice.actions;
export default friendsSlice.reducer;
