import { useMutation, useQueryClient } from "@tanstack/react-query";
import { friendService } from "../../services/friend.service";
import { useAppSelector } from "../../redux/store/hooks";

export function useFriendMutations() {
  const queryClient = useQueryClient();
  const currentUid = useAppSelector((state) => state.auth.user?.uid);

  const invalidateProfiles = () => {
    queryClient.invalidateQueries({ queryKey: ["userProfiles"] });
  };

  const sendRequest = useMutation({
    mutationFn: (targetUid: string) =>
      friendService.sendFriendRequest(currentUid!, targetUid),
    onSuccess: invalidateProfiles,
    onError: (err) => {
      console.error("❌ sendFriendRequest failed:", err); // ✅ add this
    },
  });

  const cancelRequest = useMutation({
    mutationFn: (targetUid: string) =>
      friendService.cancelRequest(currentUid!, targetUid),
    onSuccess: invalidateProfiles,
  });

  const acceptRequest = useMutation({
    mutationFn: (requesterUid: string) =>
      friendService.acceptFriendRequest(currentUid!, requesterUid),
    onSuccess: invalidateProfiles,
  });

  const rejectRequest = useMutation({
    mutationFn: (requesterUid: string) =>
      friendService.rejectFriendRequest(currentUid!, requesterUid),
    onSuccess: invalidateProfiles,
  });

  const removeFriend = useMutation({
    mutationFn: (friendUid: string) =>
      friendService.removeFriend(currentUid!, friendUid),
    onSuccess: invalidateProfiles,
  });

  return {
    sendRequest,
    cancelRequest,
    acceptRequest,
    rejectRequest,
    removeFriend,
  };
}
