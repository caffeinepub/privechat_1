import { createActor } from "@/backend";
import { PresenceStatus as BackendPresenceStatus } from "@/backend";
import type { PresenceStatus } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import type { Principal } from "@icp-sdk/core/principal";
import { useQuery } from "@tanstack/react-query";

function toFrontendStatus(status: BackendPresenceStatus): PresenceStatus {
  switch (status) {
    case BackendPresenceStatus.Online:
      return "Online";
    case BackendPresenceStatus.Away:
      return "Away";
    case BackendPresenceStatus.Offline:
      return "Offline";
  }
}

/**
 * Query the presence status for a single user.
 * Returns null while loading or if the user has no presence record.
 */
export function usePresence(userId: string): PresenceStatus | null {
  const { actor, isFetching: actorFetching } = useActor(createActor);

  const query = useQuery<PresenceStatus | null>({
    queryKey: ["presence", userId],
    queryFn: async () => {
      if (!actor) return null;
      // Build a Principal from the userId string
      const { Principal } = await import("@icp-sdk/core/principal");
      const principal: Principal = Principal.fromText(userId);
      const result = await actor.getPresence(principal);
      if (result === null) return null;
      return toFrontendStatus(result);
    },
    enabled: !!actor && !actorFetching && !!userId,
    staleTime: 10_000,
    refetchInterval: 10_000,
  });

  return query.data ?? null;
}

/**
 * Query the presence status for multiple users at once.
 * Returns a Map<userId, PresenceStatus>.
 */
export function useBulkPresence(
  userIds: string[],
): Map<string, PresenceStatus> {
  const { actor, isFetching: actorFetching } = useActor(createActor);

  const query = useQuery<Map<string, PresenceStatus>>({
    queryKey: ["presence", "bulk", userIds.slice().sort().join(",")],
    queryFn: async () => {
      if (!actor || userIds.length === 0) return new Map();
      const { Principal } = await import("@icp-sdk/core/principal");
      const principals = userIds.map((id) => Principal.fromText(id));
      const entries = await actor.getBulkPresence(principals);
      const map = new Map<string, PresenceStatus>();
      for (const [principal, status] of entries) {
        map.set(principal.toString(), toFrontendStatus(status));
      }
      return map;
    },
    enabled: !!actor && !actorFetching && userIds.length > 0,
    staleTime: 10_000,
    refetchInterval: 10_000,
  });

  return query.data ?? new Map();
}
