import { createActor } from "@/backend";
import type { MessageId, Reaction } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Query all reactions for a specific message.
 * Falls back to an empty array while loading or on error.
 */
export function useReactions(messageId: MessageId): Reaction[] {
  const { actor, isFetching: actorFetching } = useActor(createActor);

  const query = useQuery<Reaction[]>({
    queryKey: ["reactions", messageId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      const result = await actor.getReactions(messageId);
      if (result.__kind__ === "err") return [];
      return result.ok.map((r) => ({
        messageId: r.messageId,
        userId: r.userId,
        emoji: r.emoji,
        timestamp: r.timestamp,
      }));
    },
    enabled: !!actor && !actorFetching,
    staleTime: 5_000,
  });

  return query.data ?? [];
}

/** Add an emoji reaction to a message. */
export function useAddReaction() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      messageId,
      emoji,
    }: {
      messageId: MessageId;
      emoji: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.addReaction(messageId, emoji);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: (_data, { messageId }) => {
      queryClient.invalidateQueries({
        queryKey: ["reactions", messageId.toString()],
      });
    },
  });
}

/** Remove an emoji reaction from a message. */
export function useRemoveReaction() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      messageId,
      emoji,
    }: {
      messageId: MessageId;
      emoji: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await actor.removeReaction(messageId, emoji);
      if (result.__kind__ === "err") throw new Error(result.err);
    },
    onSuccess: (_data, { messageId }) => {
      queryClient.invalidateQueries({
        queryKey: ["reactions", messageId.toString()],
      });
    },
  });
}
