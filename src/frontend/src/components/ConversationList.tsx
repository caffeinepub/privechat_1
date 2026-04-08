import { createActor } from "@/backend";
import PresenceDot from "@/components/PresenceDot";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/contexts/I18nContext";
import { useFriends, useSendFriendRequest } from "@/hooks/useFriends";
import { useBulkPresence } from "@/hooks/usePresence";
import type { Conversation, Message, User } from "@/types";
import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { MessageSquare, UserPlus } from "lucide-react";
import { useMemo } from "react";
import { Button } from "./ui/button";

interface ConversationListProps {
  users: User[];
  onSelectConversation: (conversationId: bigint, otherUser: User) => void;
  activeConversationId?: bigint;
}

interface ConversationWithMeta {
  conversation: Conversation;
  otherUser: User;
  lastMessage?: Message;
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatTime(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  const d = new Date(ms);
  const now = new Date();
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();
  return isToday
    ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : d.toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function ConversationList({
  users,
  onSelectConversation,
  activeConversationId,
}: ConversationListProps) {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { identity } = useInternetIdentity();
  const { t } = useTranslation();
  const myPrincipal = identity?.getPrincipal().toString();
  const sendFriendRequest = useSendFriendRequest();
  const { friends, incoming, outgoing } = useFriends();

  const { data: conversations = [], isLoading } = useQuery<
    ConversationWithMeta[]
  >({
    queryKey: ["conversations", myPrincipal],
    queryFn: async () => {
      if (!actor || !identity) return [];
      const otherUsers = users.filter(
        (u) => u.principal.toString() !== myPrincipal,
      );
      const results: ConversationWithMeta[] = [];
      await Promise.all(
        otherUsers.map(async (otherUser) => {
          try {
            const convId = await actor.getOrCreateConversation(
              otherUser.principal,
            );
            const msgs = await actor.getMessages(convId);
            if (msgs.length === 0) return;
            const sorted = [...msgs].sort((a, b) =>
              Number(b.timestamp - a.timestamp),
            );
            results.push({
              conversation: {
                id: convId,
                participants: [identity.getPrincipal(), otherUser.principal],
                createdAt: 0n,
              },
              otherUser,
              lastMessage: sorted[0],
            });
          } catch {
            // Conversation doesn't exist yet
          }
        }),
      );
      return results.sort((a, b) => {
        const tA = a.lastMessage?.timestamp ?? 0n;
        const tB = b.lastMessage?.timestamp ?? 0n;
        return Number(tB - tA);
      });
    },
    enabled: !!actor && !actorFetching && !!identity && users.length > 0,
    staleTime: 3_000,
  });

  const partnerIds = useMemo(
    () => conversations.map((c) => c.otherUser.principal.toString()),
    [conversations],
  );
  const presenceMap = useBulkPresence(partnerIds);

  const friendSet = useMemo(
    () => new Set(friends.map((f) => f.principal.toString())),
    [friends],
  );
  const pendingSet = useMemo(() => {
    const all = [...incoming, ...outgoing];
    return new Set(
      all.map((r) => r.from.toString()).concat(all.map((r) => r.to.toString())),
    );
  }, [incoming, outgoing]);

  if (isLoading) {
    return (
      <div className="p-3 space-y-1" data-ocid="conversation-list-loading">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-3">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-3 py-14 px-4 text-center"
        data-ocid="conversation-list-empty"
      >
        <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center opacity-60">
          <MessageSquare className="h-5 w-5 text-white" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground mb-0.5">
            {t("noConversations")}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("noConversationsHint")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <ul className="py-1" data-ocid="conversation-list">
      {conversations.map(({ conversation, otherUser, lastMessage }) => {
        const isActive = conversation.id === activeConversationId;
        const isMine = lastMessage?.sender.toString() === myPrincipal;
        const uid = otherUser.principal.toString();
        const presence = presenceMap.get(uid) ?? null;
        const isFriend = friendSet.has(uid);
        const isPending = !isFriend && pendingSet.has(uid);

        return (
          <li key={conversation.id.toString()}>
            <button
              type="button"
              onClick={() => onSelectConversation(conversation.id, otherUser)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-smooth group ${
                isActive
                  ? "contact-item-active"
                  : "border-l-2 border-transparent hover:bg-primary/5 hover:border-primary/30"
              }`}
              data-ocid={`conv-item-${conversation.id}`}
            >
              <div className="relative shrink-0">
                <Avatar
                  className={`h-10 w-10 ${isActive ? "ring-2 ring-primary/40" : ""}`}
                >
                  <AvatarFallback
                    className={`text-xs font-bold ${
                      isActive
                        ? "gradient-primary text-white"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {initials(otherUser.displayName)}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-0.5 -right-0.5">
                  <PresenceDot status={presence} size="sm" />
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-sm font-semibold truncate ${isActive ? "text-primary" : "text-foreground"}`}
                  >
                    {otherUser.displayName}
                  </span>
                  {lastMessage && (
                    <span className="text-xs text-muted-foreground shrink-0">
                      {formatTime(lastMessage.timestamp)}
                    </span>
                  )}
                </div>
                {lastMessage && (
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {isMine ? t("youPrefix") : ""}
                    {lastMessage.fileAttachment
                      ? `📎 ${lastMessage.fileAttachment.filename}`
                      : lastMessage.content}
                  </p>
                )}
              </div>
              {/* Add Friend button */}
              {!isFriend && !isPending && myPrincipal !== uid && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-smooth"
                  onClick={(e) => {
                    e.stopPropagation();
                    sendFriendRequest.mutate(uid);
                  }}
                  disabled={sendFriendRequest.isPending}
                  aria-label={`${t("addFriend")} ${otherUser.displayName}`}
                  data-ocid={`btn-add-friend-conv-${uid.slice(0, 8)}`}
                >
                  <UserPlus className="h-3.5 w-3.5" />
                </Button>
              )}
              {isPending && (
                <span className="text-xs text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-smooth">
                  {t("pendingRequests")}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
