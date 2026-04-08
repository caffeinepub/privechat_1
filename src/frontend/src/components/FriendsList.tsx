import { createActor } from "@/backend";
import { useTranslation } from "@/contexts/I18nContext";
import {
  useFriends,
  useRemoveFriend,
  useRespondToFriendRequest,
} from "@/hooks/useFriends";
import { useBulkPresence } from "@/hooks/usePresence";
import type { User } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import {
  Check,
  Loader2,
  MessageSquare,
  UserMinus,
  Users,
  X,
} from "lucide-react";
import { useMemo } from "react";
import PresenceDot from "./PresenceDot";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

interface FriendsListProps {
  onSelectUser: (user: User) => void;
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function FriendsList({ onSelectUser }: FriendsListProps) {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { friends, incoming, outgoing, isLoading } = useFriends();
  const respond = useRespondToFriendRequest();
  const removeFriend = useRemoveFriend();
  const { t } = useTranslation();

  // Fetch all users to resolve displayNames for friend requests
  const { data: allUsers = [] } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listUsers();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 60_000,
  });

  const userByPrincipal = useMemo(() => {
    const map = new Map<string, User>();
    for (const u of allUsers) map.set(u.principal.toString(), u);
    return map;
  }, [allUsers]);

  const friendIds = friends.map((f) => f.principal.toString());
  const presenceMap = useBulkPresence(friendIds);

  if (isLoading) {
    return (
      <div className="p-3 space-y-2" data-ocid="friends-list-loading">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2.5">
            <Skeleton className="h-9 w-9 rounded-full shrink-0" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}
      </div>
    );
  }

  const hasAnything =
    friends.length > 0 || incoming.length > 0 || outgoing.length > 0;

  if (!hasAnything) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-3 py-14 px-4 text-center"
        data-ocid="friends-list-empty"
      >
        <Users className="h-8 w-8 text-muted-foreground/40" strokeWidth={1.5} />
        <div>
          <p className="text-sm font-medium text-foreground mb-0.5">
            {t("noFriendsYet")}
          </p>
          <p className="text-xs text-muted-foreground">{t("noFriendsHint")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col" data-ocid="friends-list">
      {/* Incoming requests */}
      {incoming.length > 0 && (
        <section className="pb-1">
          <p className="px-4 pt-3 pb-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t("friendRequests")} ({incoming.length})
          </p>
          <ul>
            {incoming.map((req) => {
              const fromId = req.from.toString();
              const fromUser = userByPrincipal.get(fromId);
              const displayName =
                fromUser?.displayName ?? `${fromId.slice(0, 12)}…`;
              const avatarInitials = fromUser
                ? initials(fromUser.displayName)
                : fromId.slice(0, 2).toUpperCase();
              return (
                <li
                  key={fromId}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50"
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                      {avatarInitials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="flex-1 text-sm font-medium text-foreground truncate min-w-0">
                    {displayName}
                  </span>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 w-7 p-0 text-[oklch(0.65_0.15_145)] hover:text-[oklch(0.55_0.15_145)] border-[oklch(0.65_0.15_145/0.3)] hover:border-[oklch(0.65_0.15_145/0.5)]"
                      onClick={() =>
                        respond.mutate({ from: fromId, accept: true })
                      }
                      disabled={respond.isPending}
                      aria-label={t("accept")}
                      data-ocid={`btn-accept-${fromId}`}
                    >
                      {respond.isPending ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Check className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 w-7 p-0 text-destructive hover:text-destructive/80 border-destructive/30"
                      onClick={() =>
                        respond.mutate({ from: fromId, accept: false })
                      }
                      disabled={respond.isPending}
                      aria-label={t("reject")}
                      data-ocid={`btn-reject-${fromId}`}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mx-4 border-t border-border mt-1" />
        </section>
      )}

      {/* Outgoing pending requests */}
      {outgoing.length > 0 && (
        <section className="pb-1">
          <p className="px-4 pt-3 pb-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t("pendingRequests")} ({outgoing.length})
          </p>
          <ul>
            {outgoing.map((req) => {
              const toId = req.to.toString();
              const toUser = userByPrincipal.get(toId);
              const displayName =
                toUser?.displayName ?? `${toId.slice(0, 12)}…`;
              const avatarInitials = toUser
                ? initials(toUser.displayName)
                : toId.slice(0, 2).toUpperCase();
              return (
                <li
                  key={toId}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50"
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="text-xs font-semibold bg-muted text-muted-foreground">
                      {avatarInitials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="flex-1 text-sm text-muted-foreground truncate min-w-0">
                    {displayName}
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {t("pendingRequests")}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="mx-4 border-t border-border mt-1" />
        </section>
      )}

      {/* Friends list */}
      {friends.length > 0 && (
        <section>
          <p className="px-4 pt-3 pb-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {t("friends")} ({friends.length})
          </p>
          <ul className="py-1">
            {friends.map((user: User) => {
              const uid = user.principal.toString();
              const presence = presenceMap.get(uid) ?? null;
              return (
                <li
                  key={uid}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 group"
                >
                  <div className="relative shrink-0">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-xs font-semibold bg-accent/15 text-accent">
                        {initials(user.displayName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute -bottom-0.5 -right-0.5">
                      <PresenceDot status={presence} size="sm" />
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-foreground truncate block">
                      {user.displayName}
                    </span>
                    {presence && (
                      <span className="text-xs text-muted-foreground">
                        {presence}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-smooth">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-accent"
                      onClick={() => onSelectUser(user)}
                      aria-label={`${t("message")} ${user.displayName}`}
                      data-ocid={`btn-message-friend-${uid.slice(0, 8)}`}
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => removeFriend.mutate(uid)}
                      disabled={removeFriend.isPending}
                      aria-label={`${t("removePin").split(" ")[0]} ${user.displayName}`}
                      data-ocid={`btn-remove-friend-${uid.slice(0, 8)}`}
                    >
                      {removeFriend.isPending ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <UserMinus className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
