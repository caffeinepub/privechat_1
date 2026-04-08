import { createActor } from "@/backend";
import type { ConversationId } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import { usePolling } from "./usePolling";

const TYPING_CLEAR_DELAY_MS = 2000;
const TYPING_POLL_MS = 1500;

/**
 * Returns a `setTyping` function that tells the backend whether the current
 * user is typing in the given conversation. Automatically clears the typing
 * state 2 seconds after the last call with `isTyping = true`.
 */
export function useSetTyping(conversationId: ConversationId) {
  const { actor } = useActor(createActor);
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  const sendTyping = useCallback(
    async (isTyping: boolean) => {
      if (!actor) return;
      try {
        await actor.setTyping(conversationId, isTyping);
      } catch {
        // Best-effort — silently ignore errors
      }
    },
    [actor, conversationId],
  );

  const setTyping = useCallback(
    (isTyping: boolean) => {
      if (isTyping) {
        // Send typing = true to backend
        if (!isTypingRef.current) {
          isTypingRef.current = true;
          void sendTyping(true);
        }

        // Reset the auto-clear debounce timer
        if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
        clearTimerRef.current = setTimeout(() => {
          isTypingRef.current = false;
          void sendTyping(false);
        }, TYPING_CLEAR_DELAY_MS);
      } else {
        // Immediately clear
        if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
        if (isTypingRef.current) {
          isTypingRef.current = false;
          void sendTyping(false);
        }
      }
    },
    [sendTyping],
  );

  // Clean up on unmount — make sure we clear typing state
  useEffect(() => {
    return () => {
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
      if (isTypingRef.current) {
        isTypingRef.current = false;
        void sendTyping(false);
      }
    };
  }, [sendTyping]);

  return { setTyping };
}

/**
 * Poll the backend for users currently typing in the given conversation.
 * Returns an array of userId strings (Principals).
 * Only polls when `enabled` is true (e.g., conversation is visible).
 */
export function useTypingIndicators(
  conversationId: ConversationId,
  enabled: boolean,
): string[] {
  const { actor, isFetching: actorFetching } = useActor(createActor);

  const query = useQuery<string[]>({
    queryKey: ["typing", conversationId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      const userIds = await actor.getTypingIndicators(conversationId);
      return userIds.map((p) => p.toString());
    },
    enabled: !!actor && !actorFetching && enabled,
    staleTime: 0,
    refetchInterval: false, // driven by usePolling below
  });

  // Use polling to continuously refresh typing state
  usePolling(
    () => {
      void query.refetch();
    },
    {
      interval: TYPING_POLL_MS,
      focusedInterval: TYPING_POLL_MS,
      enabled: !!actor && !actorFetching && enabled,
    },
  );

  return query.data ?? [];
}
