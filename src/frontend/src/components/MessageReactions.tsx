import { useTranslation } from "@/contexts/I18nContext";
import { useAddReaction, useRemoveReaction } from "@/hooks/useReactions";
import type { MessageId, Reaction } from "@/types";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Smile } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const EMOJI_LIST = ["👍", "👎", "😂", "❤️", "😮", "😢", "😡", "🔥", "✨"];

interface MessageReactionsProps {
  messageId: MessageId;
  reactions: Reaction[];
  isMine: boolean;
}

interface ReactionGroup {
  emoji: string;
  count: number;
  hasReacted: boolean;
}

export default function MessageReactions({
  messageId,
  reactions,
  isMine,
}: MessageReactionsProps) {
  const { identity } = useInternetIdentity();
  const { t } = useTranslation();
  const [showPicker, setShowPicker] = useState(false);
  const addReaction = useAddReaction();
  const removeReaction = useRemoveReaction();
  const pickerRef = useRef<HTMLDivElement>(null);
  const myPrincipal = identity?.getPrincipal().toString();

  // Group reactions by emoji
  const groups: ReactionGroup[] = EMOJI_LIST.reduce<ReactionGroup[]>(
    (acc, emoji) => {
      const matching = reactions.filter((r) => r.emoji === emoji);
      if (matching.length === 0) return acc;
      const hasReacted = matching.some(
        (r) => r.userId.toString() === myPrincipal,
      );
      acc.push({ emoji, count: matching.length, hasReacted });
      return acc;
    },
    [],
  );

  const handleReactionClick = (emoji: string, hasReacted: boolean) => {
    if (hasReacted) {
      removeReaction.mutate({ messageId, emoji });
    } else {
      addReaction.mutate({ messageId, emoji });
    }
  };

  const handlePickerEmoji = (emoji: string) => {
    setShowPicker(false);
    const existing = groups.find((g) => g.emoji === emoji);
    if (existing?.hasReacted) return; // Already reacted
    addReaction.mutate({ messageId, emoji });
  };

  // Close picker when clicking outside
  useEffect(() => {
    if (!showPicker) return;
    const handleMouseDown = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [showPicker]);

  return (
    <div
      className={`flex items-center flex-wrap gap-1 mt-1 ${isMine ? "justify-end" : "justify-start"}`}
    >
      {/* Existing reaction badges */}
      {groups.map(({ emoji, count, hasReacted }) => (
        <button
          key={emoji}
          type="button"
          onClick={() => handleReactionClick(emoji, hasReacted)}
          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs border transition-smooth ${
            hasReacted
              ? "bg-accent/20 border-accent/40 text-foreground"
              : "bg-muted/50 border-border text-muted-foreground hover:bg-muted hover:border-border/80"
          }`}
          data-ocid={`reaction-badge-${messageId}-${emoji}`}
          title={hasReacted ? t("removeReaction") : t("addReaction")}
        >
          <span>{emoji}</span>
          <span className="font-medium">{count}</span>
        </button>
      ))}

      {/* Emoji picker trigger */}
      <div ref={pickerRef} className="relative">
        <button
          type="button"
          onClick={() => setShowPicker((v) => !v)}
          className="inline-flex items-center justify-center h-5 w-5 rounded-full text-muted-foreground/60 hover:text-muted-foreground hover:bg-muted/60 transition-smooth"
          data-ocid={`btn-add-reaction-${messageId}`}
          aria-label={t("addReaction")}
        >
          <Smile className="h-3.5 w-3.5" />
        </button>

        {showPicker && (
          <div
            className={`absolute z-50 bottom-full mb-1 bg-popover border border-border shadow-lg rounded-sm p-1.5 flex gap-0.5 ${
              isMine ? "right-0" : "left-0"
            }`}
            data-ocid="emoji-picker"
          >
            {EMOJI_LIST.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handlePickerEmoji(emoji)}
                className="h-7 w-7 flex items-center justify-center text-base rounded hover:bg-muted transition-smooth"
                title={emoji}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
