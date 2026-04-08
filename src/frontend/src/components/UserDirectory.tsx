import { createActor } from "@/backend";
import PresenceDot from "@/components/PresenceDot";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/contexts/I18nContext";
import { useFriends, useSendFriendRequest } from "@/hooks/useFriends";
import { useBulkPresence } from "@/hooks/usePresence";
import type { User } from "@/types";
import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Search, UserPlus, Users } from "lucide-react";
import { useMemo, useState } from "react";

interface UserDirectoryProps {
  onSelectUser: (user: User) => void;
  activeConversationUserId?: string;
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function UserDirectory({
  onSelectUser,
  activeConversationUserId,
}: UserDirectoryProps) {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { identity } = useInternetIdentity();
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const sendFriendRequest = useSendFriendRequest();
  const { friends, incoming, outgoing } = useFriends();

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listUsers();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 10_000,
  });

  const myPrincipal = identity?.getPrincipal().toString();

  const filtered = users.filter(
    (u) =>
      u.principal.toString() !== myPrincipal &&
      u.displayName.toLowerCase().includes(search.toLowerCase()),
  );

  const userIds = useMemo(
    () => filtered.map((u) => u.principal.toString()),
    [filtered],
  );
  const presenceMap = useBulkPresence(userIds);

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

  return (
    <div className="flex flex-col h-full" data-ocid="user-directory">
      {/* Search */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("search")}
            className="pl-9 h-9 bg-muted/50 border-input text-sm"
            data-ocid="input-user-search"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-3 space-y-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center gap-3 py-12 px-4 text-center"
            data-ocid="user-directory-empty"
          >
            <Users
              className="h-8 w-8 text-muted-foreground/40"
              strokeWidth={1.5}
            />
            <p className="text-sm text-muted-foreground">
              {search ? t("noUsersYet") : t("noUsersYet")}
            </p>
          </div>
        ) : (
          <ul className="py-1">
            {filtered.map((user) => {
              const uid = user.principal.toString();
              const isActive = uid === activeConversationUserId;
              const presence = presenceMap.get(uid) ?? null;
              const isFriend = friendSet.has(uid);
              const isPending = !isFriend && pendingSet.has(uid);

              return (
                <li key={uid}>
                  <button
                    type="button"
                    onClick={() => onSelectUser(user)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-smooth group ${
                      isActive
                        ? "bg-accent/15 border-l-2 border-accent"
                        : "border-l-2 border-transparent hover:bg-muted/60"
                    }`}
                    data-ocid={`user-item-${uid.slice(0, 8)}`}
                  >
                    <div className="relative shrink-0">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback
                          className={`text-xs font-semibold ${
                            isActive
                              ? "bg-accent/20 text-accent"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          {initials(user.displayName)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="absolute -bottom-0.5 -right-0.5">
                        <PresenceDot status={presence} size="sm" />
                      </span>
                    </div>
                    <span className="flex-1 text-sm font-medium truncate text-foreground min-w-0">
                      {user.displayName}
                    </span>
                    {/* Friend action button */}
                    {isFriend ? null : isPending ? (
                      <span
                        className="text-xs text-muted-foreground shrink-0"
                        data-ocid={`status-pending-${uid.slice(0, 8)}`}
                      >
                        {t("pendingRequests")}
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-accent transition-smooth"
                        onClick={(e) => {
                          e.stopPropagation();
                          sendFriendRequest.mutate(uid);
                        }}
                        disabled={sendFriendRequest.isPending}
                        aria-label={`${t("addFriend")} ${user.displayName}`}
                        data-ocid={`btn-add-friend-${uid.slice(0, 8)}`}
                      >
                        {sendFriendRequest.isPending ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <UserPlus className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
