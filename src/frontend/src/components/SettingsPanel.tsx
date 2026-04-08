import { createActor } from "@/backend";
import PinScreen, {
  getPinHash,
  removePinHash,
  setPinHash,
} from "@/components/PinScreen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { type Language, useTranslation } from "@/contexts/I18nContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useActor } from "@caffeineai/core-infrastructure";
import { Eye, EyeOff, Moon, Sun } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface SettingsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type PinFlow =
  | "none"
  | "verify-to-change"
  | "set-new"
  | "verify-to-remove"
  | "setup";

const LANGUAGES: {
  code: Language;
  labelKey: "langEn" | "langEl" | "langRo";
}[] = [
  { code: "en", labelKey: "langEn" },
  { code: "el", labelKey: "langEl" },
  { code: "ro", labelKey: "langRo" },
];

export default function SettingsPanel({
  open,
  onOpenChange,
}: SettingsPanelProps) {
  const { theme, toggleTheme } = useTheme();
  const { t, language, setLanguage } = useTranslation();
  const { actor } = useActor(createActor);
  const [pinFlow, setPinFlow] = useState<PinFlow>("none");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);

  // Load preferences from backend once on first actor ready.
  const [prefLoaded, setPrefLoaded] = useState(false);
  const loadPrefs = useCallback(async () => {
    if (!actor || prefLoaded) return;
    setPrefLoaded(true);
    const prefs = await actor.getUserPreferences();
    if (!prefs) return;
    if (
      (prefs.language === "en" ||
        prefs.language === "el" ||
        prefs.language === "ro") &&
      prefs.language !== language
    ) {
      setLanguage(prefs.language as Language);
    }
  }, [actor, prefLoaded, language, setLanguage]);

  useEffect(() => {
    loadPrefs();
  }, [loadPrefs]);

  const hasPinSet = !!getPinHash();

  const syncPrefsToBackend = async (pinHash?: string | null) => {
    if (!actor) return;
    try {
      await actor.setUserPreferences(
        theme,
        language,
        pinHash !== undefined ? pinHash : getPinHash(),
      );
    } catch {
      // best-effort
    }
  };

  const handleLanguageChange = async (lang: Language) => {
    setLanguage(lang);
    if (!actor) return;
    try {
      await actor.setUserPreferences(theme, lang, getPinHash());
    } catch {
      // best-effort
    }
  };

  const handleThemeToggle = async (targetTheme: "light" | "dark") => {
    if (theme !== targetTheme) {
      toggleTheme();
      if (!actor) return;
      try {
        await actor.setUserPreferences(targetTheme, language, getPinHash());
      } catch {
        // best-effort
      }
    }
  };

  const resetPinState = () => {
    setPinFlow("none");
    setNewPin("");
    setConfirmPin("");
    setPinError(null);
    setShowNew(false);
  };

  const handleRemovePin = async () => {
    await removePinHash();
    await syncPrefsToBackend(null);
    toast.success(t("pinRemoved"));
    resetPinState();
  };

  const handleSaveNewPin = async () => {
    if (newPin !== confirmPin) {
      setPinError(t("pinsDoNotMatch"));
      return;
    }
    await setPinHash(newPin);
    await syncPrefsToBackend(getPinHash());
    toast.success(t("pinSet"));
    resetPinState();
  };

  // If a pin-screen sub-flow is active, show the full-screen PinScreen overlay
  if (pinFlow === "verify-to-change") {
    return (
      <PinScreen
        mode="verify"
        onSuccess={() => setPinFlow("set-new")}
        onCancel={resetPinState}
      />
    );
  }
  if (pinFlow === "verify-to-remove") {
    return (
      <PinScreen
        mode="verify"
        onSuccess={handleRemovePin}
        onCancel={resetPinState}
      />
    );
  }
  if (pinFlow === "setup") {
    return (
      <PinScreen
        mode="setup"
        onSuccess={async () => {
          await syncPrefsToBackend(getPinHash());
          toast.success(t("pinSet"));
          resetPinState();
        }}
        onCancel={resetPinState}
      />
    );
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) resetPinState();
      }}
    >
      <SheetContent
        side="right"
        className="w-80 bg-card border-l border-border p-0 flex flex-col"
        data-ocid="settings-panel"
      >
        <SheetHeader className="px-5 pt-5 pb-4 border-b border-border">
          <SheetTitle className="font-display text-base font-semibold text-foreground">
            {t("settings")}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          {/* Language */}
          <section className="space-y-3" data-ocid="settings-language">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("language")}
            </Label>
            <div className="flex flex-col gap-1">
              {LANGUAGES.map(({ code, labelKey }) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => handleLanguageChange(code)}
                  className={`flex items-center justify-between px-3 py-2 text-sm rounded-sm transition-colors ${
                    language === code
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground hover:bg-muted"
                  }`}
                  data-ocid={`lang-option-${code}`}
                >
                  <span>{t(labelKey)}</span>
                  {language === code && (
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </button>
              ))}
            </div>
          </section>

          <Separator />

          {/* Theme */}
          <section className="space-y-3" data-ocid="settings-theme">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("theme")}
            </Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleThemeToggle("light")}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm border rounded-sm transition-colors ${
                  theme === "light"
                    ? "bg-primary/10 border-primary/30 text-primary font-medium"
                    : "border-border text-muted-foreground hover:bg-muted"
                }`}
                data-ocid="theme-light"
              >
                <Sun className="h-3.5 w-3.5" />
                {t("light")}
              </button>
              <button
                type="button"
                onClick={() => handleThemeToggle("dark")}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm border rounded-sm transition-colors ${
                  theme === "dark"
                    ? "bg-primary/10 border-primary/30 text-primary font-medium"
                    : "border-border text-muted-foreground hover:bg-muted"
                }`}
                data-ocid="theme-dark"
              >
                <Moon className="h-3.5 w-3.5" />
                {t("dark")}
              </button>
            </div>
          </section>

          <Separator />

          {/* PIN management */}
          <section className="space-y-3" data-ocid="settings-pin">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("pinManagement")}
            </Label>

            <p className="text-xs text-muted-foreground">
              {hasPinSet ? t("pinEnabled") : t("pinDisabled")}
            </p>

            {/* Set-new-pin inline form (after verifying old one) */}
            {pinFlow === "set-new" && (
              <div className="space-y-3 p-3 bg-muted/40 border border-border rounded-sm">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    {t("newPin")}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showNew ? "text" : "password"}
                      value={newPin}
                      onChange={(e) => {
                        setNewPin(e.target.value);
                        setPinError(null);
                      }}
                      placeholder="••••••••"
                      className="pr-9 text-sm"
                      autoFocus
                      data-ocid="input-new-pin"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew((v) => !v)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      tabIndex={-1}
                    >
                      {showNew ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    {t("confirmNewPin")}
                  </Label>
                  <Input
                    type={showNew ? "text" : "password"}
                    value={confirmPin}
                    onChange={(e) => {
                      setConfirmPin(e.target.value);
                      setPinError(null);
                    }}
                    placeholder="••••••••"
                    className="text-sm"
                    data-ocid="input-confirm-new-pin"
                  />
                </div>
                {pinError && (
                  <p className="text-xs text-destructive" role="alert">
                    {pinError}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSaveNewPin}
                    className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                    data-ocid="btn-save-new-pin"
                  >
                    {t("save")}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={resetPinState}
                    className="flex-1"
                    data-ocid="btn-cancel-pin"
                  >
                    {t("cancel")}
                  </Button>
                </div>
              </div>
            )}

            {pinFlow === "none" && (
              <div className="flex flex-col gap-2">
                {!hasPinSet ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPinFlow("setup")}
                    className="w-full"
                    data-ocid="btn-enable-pin"
                  >
                    {t("enablePin")}
                  </Button>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPinFlow("verify-to-change")}
                      className="w-full"
                      data-ocid="btn-change-pin"
                    >
                      {t("changePin")}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPinFlow("verify-to-remove")}
                      className="w-full text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/5"
                      data-ocid="btn-remove-pin"
                    >
                      {t("removePin")}
                    </Button>
                  </>
                )}
              </div>
            )}
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
