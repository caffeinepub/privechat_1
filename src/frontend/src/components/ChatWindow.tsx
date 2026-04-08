import { createActor } from "@/backend";
import FileAttachmentView from "@/components/FileAttachmentView";
import MessageReactions from "@/components/MessageReactions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/contexts/I18nContext";
import { usePolling } from "@/hooks/usePolling";
import { useTypingIndicators } from "@/hooks/useTyping";
import type { Message, User } from "@/types";
import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

interface ChatWindowProps {
  conversationId: bigint;
  otherUser: User;
  onRefreshConversations: () => void;
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts / 1_000_000n);
  return new Date(ms).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChatWindow({
  conversationId,
  otherUser,
  onRefreshConversations,
}: ChatWindowProps) {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { identity } = useInternetIdentity();
  const { t } = useTranslation();
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const myPrincipal = identity?.getPrincipal().toString();

  const {
    data: messages = [],
    isLoading,
    refetch,
  } = useQuery<Message[]>({
    queryKey: ["messages", conversationId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMessages(conversationId);
    },
    enabled: !!actor && !actorFetching,
    staleTime: 1_000,
  });

  const sorted = [...messages].sort((a, b) =>
    Number(a.timestamp - b.timestamp),
  );

  usePolling(
    () => {
      refetch();
      onRefreshConversations();
    },
    {
      interval: 2000,
      focusedInterval: 500,
      enabled: !!actor && !actorFetching,
    },
  );

  const prevCount = useRef(0);
  useEffect(() => {
    if (sorted.length !== prevCount.current) {
      prevCount.current = sorted.length;
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  });

  const typingUserIds = useTypingIndicators(
    conversationId,
    !!actor && !actorFetching,
  );
  const othersTyping = typingUserIds.filter((id) => id !== myPrincipal);

  if (isLoading) {
    return (
      <div
        className="flex-1 flex flex-col gap-4 p-6 overflow-y-auto bg-background"
        data-ocid="chat-window-loading"
      >
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`flex items-end gap-2 ${i % 2 === 0 ? "flex-row-reverse" : ""}`}
          >
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
            <Skeleton
              className={`h-12 w-48 rounded-2xl ${i % 2 === 0 ? "ml-auto" : ""}`}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto flex flex-col gap-1 p-4 bg-background focus:outline-none"
      tabIndex={-1}
      data-ocid="chat-window"
    >
      {sorted.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl gradient-primary mx-auto flex items-center justify-center opacity-60">
              <span className="text-2xl">👋</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("sayHelloTo")}{" "}
              <span className="font-semibold text-foreground">
                {otherUser.displayName}
              </span>
              !
            </p>
          </div>
        </div>
      ) : (
        <>
          {sorted.map((msg, idx) => {
            const isMine = msg.sender.toString() === myPrincipal;
            const senderName = isMine ? t("senderYou") : otherUser.displayName;
            const prevMsg = idx > 0 ? sorted[idx - 1] : null;
            const sameGroup =
              prevMsg && prevMsg.sender.toString() === msg.sender.toString();
            const reactions = msg.reactions ?? [];

            return (
              <div
                key={msg.id.toString()}
                className={`flex items-end gap-2 ${isMine ? "flex-row-reverse" : ""} ${
                  sameGroup ? "mt-0.5" : "mt-4"
                } group`}
                data-ocid={`msg-${msg.id}`}
              >
                {/* Avatar — only on first in group */}
                <div className="h-8 w-8 shrink-0">
                  {!sameGroup && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback
                        className={`text-xs font-bold ${
                          isMine
                            ? "gradient-primary text-white"
                            : "bg-accent/15 text-accent"
                        }`}
                      >
                        {initials(senderName)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>

                <div
                  className={`flex flex-col gap-0.5 max-w-[70%] ${
                    isMine ? "items-end" : "items-start"
                  }`}
                >
                  {/* Sender + time header */}
                  {!sameGroup && (
                    <div
                      className={`flex items-baseline gap-2 ${isMine ? "flex-row-reverse" : ""}`}
                    >
                      <span className="text-xs font-semibold text-foreground">
                        {senderName}
                      </span>
                      <span className="text-xs text-muted-foreground/70">
                        {formatTimestamp(msg.timestamp)}
                      </span>
                    </div>
                  )}

                  {/* Bubble */}
                  <div
                    className={`px-4 py-2.5 text-sm leading-relaxed break-words ${
                      isMine ? "message-bubble-sent" : "message-bubble-received"
                    }`}
                  >
                    {msg.content && <p>{msg.content}</p>}
                    {msg.fileAttachment && (
                      <FileAttachmentView attachment={msg.fileAttachment} />
                    )}
                  </div>

                  {/* Grouped time */}
                  {sameGroup && (
                    <span className="text-xs text-muted-foreground/50 px-1">
                      {formatTimestamp(msg.timestamp)}
                    </span>
                  )}

                  {/* Reactions */}
                  <MessageReactions
                    messageId={msg.id}
                    reactions={reactions}
                    isMine={isMine}
                  />
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {othersTyping.length > 0 && (
            <div
              className="flex items-center gap-2 mt-3 ml-10 pl-2"
              data-ocid="typing-indicator"
            >
              <div className="flex gap-1 items-center px-3 py-2 bg-card border border-border rounded-2xl rounded-bl-sm">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
              <span className="text-xs text-muted-foreground italic">
                {otherUser.displayName} {t("typing")}
              </span>
            </div>
          )}

          <div ref={bottomRef} />
        </>
      )}
    </div>
  );
}
