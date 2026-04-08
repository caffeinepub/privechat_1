import { ExternalBlob, createActor } from "@/backend";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/contexts/I18nContext";
import { useSetTyping } from "@/hooks/useTyping";
import {
  createActorWithConfig,
  useActor,
} from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Paperclip, Send } from "lucide-react";
import { useCallback, useRef, useState } from "react";

interface MessageInputProps {
  conversationId: bigint;
  recipientName: string;
}

/**
 * Upload a file via the object-storage gateway used by the platform.
 * We create a short-lived actor via createActorWithConfig to intercept
 * the uploadFile / downloadFile functions that are wired up with StorageClient.
 * This gives us a durable CDN URL that persists across page reloads.
 */
async function uploadFileDurable(file: File): Promise<string> {
  let capturedUpload: ((blob: ExternalBlob) => Promise<Uint8Array>) | null =
    null;
  let capturedDownload: ((bytes: Uint8Array) => Promise<ExternalBlob>) | null =
    null;

  await createActorWithConfig(
    (canisterId, uploadFile, downloadFile, options) => {
      capturedUpload = uploadFile;
      capturedDownload = downloadFile;
      return createActor(canisterId, uploadFile, downloadFile, options);
    },
  );

  if (!capturedUpload || !capturedDownload) {
    throw new Error("Storage client not initialized");
  }

  const upload = capturedUpload as (blob: ExternalBlob) => Promise<Uint8Array>;
  const download = capturedDownload as (
    bytes: Uint8Array,
  ) => Promise<ExternalBlob>;

  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  const blob = ExternalBlob.fromBytes(bytes);

  // Upload to object-storage — returns opaque hash bytes
  const hashBytes = await upload(blob);
  // Download resolves hash bytes to a durable CDN URL
  const resultBlob = await download(hashBytes);
  return resultBlob.getDirectURL();
}

export default function MessageInput({
  conversationId,
  recipientName,
}: MessageInputProps) {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setTyping } = useSetTyping(conversationId);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    setTyping(val.length > 0);
  };

  const send = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed || !actor || sending) return;
    setSending(true);
    setTyping(false);
    try {
      await actor.sendMessage(conversationId, trimmed);
      setText("");
      queryClient.invalidateQueries({
        queryKey: ["messages", conversationId.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    } finally {
      setSending(false);
      textareaRef.current?.focus();
    }
  }, [text, actor, sending, conversationId, queryClient, setTyping]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !actor) return;
      e.target.value = ""; // Reset so same file can be re-selected

      setUploading(true);
      try {
        // Upload to object-storage via platform gateway → get a durable persistent URL
        const fileId = await uploadFileDurable(file);

        const result = await actor.sendFileMessage(
          conversationId,
          fileId,
          file.name,
          file.type || "application/octet-stream",
          BigInt(file.size),
        );

        if (result.__kind__ === "err") {
          console.error("File send failed:", result.err);
          return;
        }

        queryClient.invalidateQueries({
          queryKey: ["messages", conversationId.toString()],
        });
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      } catch (err) {
        console.error("File upload error:", err);
      } finally {
        setUploading(false);
        textareaRef.current?.focus();
      }
    },
    [actor, conversationId, queryClient],
  );

  const isBusy = actorFetching || sending || uploading;

  return (
    <div
      className="border-t border-border bg-card px-4 py-3 flex items-end gap-2"
      data-ocid="message-input-bar"
    >
      {/* File upload input (hidden) */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept="*/*"
        data-ocid="input-file-upload"
      />

      {/* File upload button */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleFileClick}
        disabled={isBusy}
        className="h-10 w-9 p-0 shrink-0 text-muted-foreground hover:text-accent transition-smooth"
        aria-label={t("sendFile")}
        data-ocid="btn-attach-file"
      >
        {uploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Paperclip className="h-4 w-4" />
        )}
      </Button>

      <Textarea
        ref={textareaRef}
        value={text}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        placeholder={`${t("typeAMessage").replace("…", "")} ${recipientName}…`}
        rows={1}
        disabled={isBusy}
        className="flex-1 resize-none min-h-[40px] max-h-32 bg-muted/50 border-input text-sm leading-relaxed py-2.5 px-3 focus-visible:ring-accent overflow-y-auto"
        style={{ scrollbarWidth: "none" }}
        data-ocid="input-message"
      />
      <Button
        onClick={send}
        disabled={!text.trim() || isBusy}
        className="h-10 w-10 p-0 shrink-0 bg-accent hover:bg-accent/90 text-accent-foreground disabled:opacity-40 transition-smooth"
        aria-label={t("send")}
        data-ocid="btn-send-message"
      >
        {sending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
