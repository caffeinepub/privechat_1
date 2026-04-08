import { useTranslation } from "@/contexts/I18nContext";
import type { PresenceStatus } from "@/types";

interface PresenceDotProps {
  status: PresenceStatus | null;
  size?: "sm" | "md";
  className?: string;
}

const statusColors: Record<PresenceStatus, string> = {
  Online: "bg-[oklch(0.7_0.15_145)]",
  Away: "bg-[oklch(0.8_0.15_85)]",
  Offline: "bg-[oklch(0.5_0_0)]",
};

const statusKeys: Record<
  PresenceStatus,
  "statusOnline" | "statusAway" | "statusOffline"
> = {
  Online: "statusOnline",
  Away: "statusAway",
  Offline: "statusOffline",
};

export default function PresenceDot({
  status,
  size = "sm",
  className = "",
}: PresenceDotProps) {
  const { t } = useTranslation();

  if (!status) return null;

  const color = statusColors[status];
  const label = t(statusKeys[status]);
  const sizeClass = size === "sm" ? "h-2 w-2" : "h-2.5 w-2.5";

  return (
    <span
      className={`inline-block rounded-full shrink-0 ${sizeClass} ${color} ${className}`}
      title={label}
      aria-label={label}
    />
  );
}
