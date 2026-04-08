import { createActor } from "@/backend";
import { FriendStatus as BackendFriendStatus } from "@/backend";
import type { FriendRequest, FriendStatus, User } from "@/types";
import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function toFrontendFriendStatus(status: BackendFriendStatus): FriendStatus {
  switch (status) {
    case BackendFriendStatus.Accepted:
      return "Accepted";
    case BackendFriendStatus.Rejected:
      return "Rejected";
    case BackendFriendStatus.Pending:
      return "Pending";
  }
}

function normalizeFriendRequest(raw: {
  from: FriendRequest["from"];
  to: FriendRequest["to"];
  status: BackendFriendStatus;
  timestamp: bigint;
}): FriendRequest {
  return {
    from: raw.from,
    to: raw.to,
    status: toFrontendFriendStatus(raw.status),
    timestamp: raw.timestamp,
  };
}

interface UseFriendsResult {
  friends: User[];
  incoming: FriendRequest[];
  outgoing: FriendRequest[];
  isLoading: boolean;
}

/**
 * Returns the current user's friends and friend requests (split into
 * incoming / outgoing), plus the loading state.
 */
export function useFriends(): UseFriendsResult {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { identity } = useInternetIdentity();
  const myPrincipal = identity?.getPrincipal().toString();

  const friendsQuery = useQuery<User[]>({
    queryKey: ["friends"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listFriends();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 30_000,
  });

  const requestsQuery = useQuery<FriendRequest[]>({
    queryKey: ["friendRequests"],
    queryFn: async () => {
      if (!actor) return [];
      const raw = await actor.listFriendRequests();
      return raw.map(normalizeFriendRequest);
    },
    enabled: !!actor && !actorFetching,
    staleTime: 15_000,
  });

  const allRequests = requestsQuery.data ?? [];
  // Split requests by current user's principal: incoming = sent TO me, outgoing = sent FROM me
  const incoming = allRequests.filter(
    (r) => r.status === "Pending" && r.to.toString() === myPrincipal,
  );
  const outgoing = allRequests.filter(
    (r) => r.status === "Pending" && r.from.toString() === myPrincipal,
  );

  return {
    friends: friendsQuery.data ?? [],
    incoming,
    outgoing,
    isLoading:
      actorFetching || friendsQuery.isLoading || requestsQuery.isLoading,
  };
}

/** Send a friend request to another user. */
export function useSendFriendRequest() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      if (!actor) throw new Error("Actor not ready");
      const { Principal } = await import("@icp-sdk/core/principal");
      const principal = Principal.fromText(userId);
      const result = await actor.sendFriendRequest(principal);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    },
  });
}

/** Accept or reject a pending friend request. */
export function useRespondToFriendRequest() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      from,
      accept,
    }: {
      from: string;
      accept: boolean;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      const { Principal } = await import("@icp-sdk/core/principal");
      const principal = Principal.fromText(from);
      const result = await actor.respondToFriendRequest(principal, accept);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    },
  });
}

/** Remove an existing friend. */
export function useRemoveFriend() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      if (!actor) throw new Error("Actor not ready");
      const { Principal } = await import("@icp-sdk/core/principal");
      const principal = Principal.fromText(userId);
      const result = await actor.removeFriend(principal);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });
}
