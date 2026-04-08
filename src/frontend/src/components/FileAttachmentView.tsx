import type { FileAttachment } from "@/types";
import { Download, File, FileImage, FileText, FileVideo } from "lucide-react";

interface FileAttachmentViewProps {
  attachment: FileAttachment;
}

function formatBytes(bytes: bigint): string {
  const n = Number(bytes);
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function FileIcon({ mimeType }: { mimeType: string }) {
  if (mimeType.startsWith("image/"))
    return <FileImage className="h-5 w-5 shrink-0" />;
  if (mimeType.startsWith("video/"))
    return <FileVideo className="h-5 w-5 shrink-0" />;
  if (mimeType.startsWith("text/") || mimeType.includes("pdf"))
    return <FileText className="h-5 w-5 shrink-0" />;
  return <File className="h-5 w-5 shrink-0" />;
}

export default function FileAttachmentView({
  attachment,
}: FileAttachmentViewProps) {
  const { fileId, filename, mimeType, size } = attachment;

  return (
    <a
      href={fileId}
      target="_blank"
      rel="noopener noreferrer"
      download={filename}
      className="flex items-center gap-2.5 px-3 py-2.5 mt-1.5 rounded-sm bg-muted/60 border border-border hover:bg-muted transition-smooth max-w-[260px] group"
      data-ocid="file-attachment"
    >
      <span className="text-muted-foreground group-hover:text-foreground transition-colors">
        <FileIcon mimeType={mimeType} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-foreground truncate">
          {filename}
        </p>
        <p className="text-xs text-muted-foreground">{formatBytes(size)}</p>
      </div>
      <Download className="h-3.5 w-3.5 text-muted-foreground shrink-0 group-hover:text-accent transition-colors" />
    </a>
  );
}
