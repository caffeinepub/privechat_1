import {
  PresenceStatus as BackendPresenceStatus,
  createActor,
} from "@/backend";
import PresenceDot from "@/components/PresenceDot";
import SettingsPanel from "@/components/SettingsPanel";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/contexts/I18nContext";
import type { PresenceStatus, User as UserType } from "@/types";
import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, MessageSquareLock, Settings, User } from "lucide-react";
import { useCallback, useState } from "react";

interface HeaderProps {
  currentUser: UserType | null;
  displayName?: string;
}

const STATUS_CYCLE: PresenceStatus[] = ["Online", "Away", "Offline"];

const STATUS_TO_BACKEND: Record<PresenceStatus, BackendPresenceStatus> = {
  Online: BackendPresenceStatus.Online,
  Away: BackendPresenceStatus.Away,
  Offline: BackendPresenceStatus.Offline,
};

export default function Header({ currentUser, displayName }: HeaderProps) {
  const { clear, identity } = useInternetIdentity();
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [myStatus, setMyStatus] = useState<PresenceStatus>("Online");
  const [settingsOpen, setSettingsOpen] = useState(false);

  const name = displayName ?? currentUser?.displayName ?? "You";
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    clear();
    queryClient.clear();
  };

  const handleCycleStatus = useCallback(async () => {
    if (!actor) return;
    const nextIdx = (STATUS_CYCLE.indexOf(myStatus) + 1) % STATUS_CYCLE.length;
    const next = STATUS_CYCLE[nextIdx];
    setMyStatus(next);
    try {
      await actor.setPresence(STATUS_TO_BACKEND[next]);
    } catch {
      // Best-effort
    }
  }, [actor, myStatus]);

  const statusLabel =
    myStatus === "Online"
      ? t("statusOnline")
      : myStatus === "Away"
        ? t("statusAway")
        : t("statusOffline");

  return (
    <>
      <header
        className="h-14 border-b border-border flex items-center justify-between px-4 shrink-0 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(var(--card)) 0%, oklch(var(--primary) / 0.04) 100%)",
        }}
        data-ocid="header"
      >
        {/* Subtle gradient accent bar at top */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: "var(--gradient-primary)" }}
          aria-hidden="true"
        />

        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-sm">
            <MessageSquareLock className="h-4 w-4 text-white" strokeWidth={2} />
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-foreground">
            {t("appName")}
          </span>
        </div>

        {/* User + Status + Settings + Logout */}
        {identity && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                  <AvatarFallback className="gradient-primary text-white text-xs font-bold">
                    {initials || <User className="h-3.5 w-3.5" />}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  onClick={handleCycleStatus}
                  className="absolute -bottom-0.5 -right-0.5 rounded-full focus-visible:outline-primary"
                  aria-label={`${t("statusOnline")}: ${statusLabel}. Click to change`}
                  data-ocid="btn-cycle-status"
                >
                  <PresenceDot status={myStatus} size="sm" />
                </button>
              </div>
              <span
                className="text-sm font-semibold text-foreground hidden sm:block"
                data-ocid="header-username"
              >
                {name}
              </span>
            </div>

            {/* Settings button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSettingsOpen(true)}
              className="gap-1.5 text-xs text-muted-foreground hover:text-primary hover:bg-primary/8 transition-smooth"
              aria-label={t("settings")}
              data-ocid="btn-settings"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">{t("settings")}</span>
            </Button>

            {/* Logout button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-1.5 text-xs border-border hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-smooth"
              data-ocid="btn-logout"
            >
              <LogOut className="h-3.5 w-3.5" />
              {t("logout")}
            </Button>
          </div>
        )}
      </header>

      {/* Settings slide-over */}
      <SettingsPanel open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
