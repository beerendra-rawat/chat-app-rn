import { useQuery } from "@tanstack/react-query";
import { friendService } from "../../services/friend.service";

export function useUserProfiles(uids: string[]) {
  return useQuery({
    queryKey: ["userProfiles", [...uids].sort()],
    queryFn: () => friendService.getUsersByIds(uids),
    enabled: uids.length > 0,
  });
}
