import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../redux/store/hooks";
import { friendService } from "../services/friend.service";
import {
  setFriends,
  setSentRequests,
  setReceivedRequests,
  setFriendsLoading,
  resetFriendsState,
} from "../redux/slice/friendsSlice";

export function useFriendsSync() {
  const dispatch = useAppDispatch();
  const currentUid = useAppSelector((state) => state.auth.user?.uid);

  useEffect(() => {
    if (!currentUid) {
      dispatch(resetFriendsState());
      return;
    }

    dispatch(setFriendsLoading(true));

    const unsubscribe = friendService.subscribeToUserRelations(
      currentUid,
      ({ friends, sentRequests, receivedRequests }) => {
        dispatch(setFriends(friends));
        dispatch(setSentRequests(sentRequests));
        dispatch(setReceivedRequests(receivedRequests));
        dispatch(setFriendsLoading(false));
      },
    );

    return () => unsubscribe();
  }, [currentUid, dispatch]);
}
