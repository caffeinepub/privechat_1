import { createActor } from "@/backend";
import type { User } from "@/types";
import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useCurrentUser() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const userQuery = useQuery<User | null>({
    queryKey: ["currentUser", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return null;
      try {
        // Use the UPDATE function (not query) so we always see the freshest
        // committed state — avoids the snapshot-staleness race condition where
        // a query would return an empty list right after registerUser completes.
        return await actor.getCurrentUser();
      } catch {
        // Treat any failure as "not registered yet" rather than crashing
        return null;
      }
    },
    enabled: !!actor && !actorFetching && !!identity,
    // Retry once on failure in case of transient backend errors
    retry: 1,
    retryDelay: 500,
    // Keep data fresh for 30s — prevents an immediate background refetch from
    // overwriting the optimistic cache entry set right after registerUser().
    staleTime: 30_000,
  });

  // isFetched is true once the query has completed (success or error),
  // regardless of actorFetching state — this prevents the ProfileGate
  // from being stuck in a loading state after a query has resolved.
  const isFetched = userQuery.isFetched;

  // isLoading is true while either the actor is being set up or the query is running
  const isLoading =
    actorFetching || userQuery.isLoading || userQuery.isFetching;

  const clearCurrentUser = () => {
    queryClient.removeQueries({ queryKey: ["currentUser"] });
  };

  return {
    user: userQuery.data ?? null,
    isLoading,
    isFetched,
    clearCurrentUser,
    identity,
  };
}
