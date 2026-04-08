import { createActor } from "@/backend";
import ChatWindow from "@/components/ChatWindow";
import ConversationList from "@/components/ConversationList";
import EmptyState from "@/components/EmptyState";
import FriendsList from "@/components/FriendsList";
import MessageInput from "@/components/MessageInput";
import PresenceDot from "@/components/PresenceDot";
import UserDirectory from "@/components/UserDirectory";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/contexts/I18nContext";
import { useBulkPresence } from "@/hooks/usePresence";
import type { User } from "@/types";
import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, MessageSquare, UserCheck, Users } from "lucide-react";
import { useCallback, useState } from "react";

interface ActiveChat {
  conversationId: bigint;
  otherUser: User;
}

export default function ChatPage() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const [activeChat, setActiveChat] = useState<ActiveChat | null>(null);
  const [showChat, setShowChat] = useState(false);

  const myPrincipal = identity?.getPrincipal().toString();

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listUsers();
    },
    enabled: !!actor && !actorFetching,
    staleTime: 10_000,
  });

  const handleSelectUser = useCallback(
    async (user: User) => {
      if (!actor) return;
      const convId = await actor.getOrCreateConversation(user.principal);
      setActiveChat({ conversationId: convId, otherUser: user });
      setShowChat(true);
      queryClient.invalidateQueries({
        queryKey: ["messages", convId.toString()],
      });
    },
    [actor, queryClient],
  );

  const handleSelectConversation = useCallback(
    (conversationId: bigint, otherUser: User) => {
      setActiveChat({ conversationId, otherUser });
      setShowChat(true);
    },
    [],
  );

  const handleRefreshConversations = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["conversations", myPrincipal] });
  }, [queryClient, myPrincipal]);

  const handleBack = () => {
    setShowChat(false);
  };

  const activeUserId = activeChat?.otherUser.principal.toString();
  const partnerIds = activeUserId ? [activeUserId] : [];
  const partnerPresence = useBulkPresence(partnerIds);
  const partnerStatus = activeUserId
    ? (partnerPresence.get(activeUserId) ?? null)
    : null;

  return (
    <>
      {/* ── Left Panel ───────────────────────────────────────── */}
      <aside
        className={`
          w-full md:w-80 lg:w-[340px] shrink-0 border-r border-border bg-card flex flex-col
          ${showChat ? "hidden md:flex" : "flex"}
        `}
        data-ocid="left-panel"
      >
        <Tabs defaultValue="conversations" className="flex flex-col h-full">
          {/* Tab triggers */}
          <div className="px-3 pt-3 pb-0 border-b border-border">
            <TabsList className="w-full bg-muted/60 h-9">
              <TabsTrigger
                value="conversations"
                className="flex-1 gap-1.5 text-xs data-[state=active]:gradient-primary data-[state=active]:text-white data-[state=active]:shadow-sm transition-smooth"
                data-ocid="tab-conversations"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t("conversations")}</span>
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="flex-1 gap-1.5 text-xs data-[state=active]:gradient-primary data-[state=active]:text-white data-[state=active]:shadow-sm transition-smooth"
                data-ocid="tab-users"
              >
                <Users className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t("users")}</span>
              </TabsTrigger>
              <TabsTrigger
                value="friends"
                className="flex-1 gap-1.5 text-xs data-[state=active]:gradient-primary data-[state=active]:text-white data-[state=active]:shadow-sm transition-smooth"
                data-ocid="tab-friends"
              >
                <UserCheck className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t("friends")}</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Conversations tab */}
          <TabsContent
            value="conversations"
            className="flex-1 overflow-hidden m-0 data-[state=active]:flex data-[state=active]:flex-col"
          >
            <div className="flex-1 overflow-y-auto">
              <ConversationList
                users={users}
                onSelectConversation={handleSelectConversation}
                activeConversationId={activeChat?.conversationId}
              />
            </div>
          </TabsContent>

          {/* Users tab */}
          <TabsContent
            value="users"
            className="flex-1 overflow-hidden m-0 data-[state=active]:flex data-[state=active]:flex-col"
          >
            <div className="flex-1 overflow-y-auto">
              <UserDirectory
                onSelectUser={handleSelectUser}
                activeConversationUserId={activeUserId}
              />
            </div>
          </TabsContent>

          {/* Friends tab */}
          <TabsContent
            value="friends"
            className="flex-1 overflow-hidden m-0 data-[state=active]:flex data-[state=active]:flex-col"
          >
            <div className="flex-1 overflow-y-auto">
              <FriendsList onSelectUser={handleSelectUser} />
            </div>
          </TabsContent>
        </Tabs>
      </aside>

      {/* ── Right Panel (Chat) ────────────────────────────────── */}
      <main
        className={`
          flex-1 flex flex-col overflow-hidden bg-background
          ${showChat ? "flex" : "hidden md:flex"}
        `}
        data-ocid="chat-panel"
      >
        {activeChat ? (
          <>
            {/* Chat header */}
            <div
              className="h-14 border-b border-border flex items-center gap-3 px-4 shrink-0 relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, oklch(var(--card)) 0%, oklch(var(--primary) / 0.03) 100%)",
              }}
            >
              {/* Top accent bar */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px] opacity-50"
                style={{ background: "var(--gradient-accent)" }}
                aria-hidden="true"
              />

              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="md:hidden h-8 w-8 p-0 -ml-1 hover:text-primary hover:bg-primary/8"
                aria-label={t("backToConversations")}
                data-ocid="btn-back"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative shrink-0">
                  <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-white shadow-sm">
                    {activeChat.otherUser.displayName.slice(0, 2).toUpperCase()}
                  </div>
                  {partnerStatus && (
                    <span className="absolute -bottom-0.5 -right-0.5">
                      <PresenceDot status={partnerStatus} size="sm" />
                    </span>
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-display font-semibold text-sm text-foreground truncate leading-tight">
                    {activeChat.otherUser.displayName}
                  </span>
                  {partnerStatus && (
                    <span className="text-xs text-muted-foreground leading-none">
                      {partnerStatus}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            <ChatWindow
              conversationId={activeChat.conversationId}
              otherUser={activeChat.otherUser}
              onRefreshConversations={handleRefreshConversations}
            />

            {/* Message input */}
            <MessageInput
              conversationId={activeChat.conversationId}
              recipientName={activeChat.otherUser.displayName}
            />
          </>
        ) : (
          <EmptyState />
        )}
      </main>
    </>
  );
}
