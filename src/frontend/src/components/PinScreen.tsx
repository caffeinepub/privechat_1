import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/contexts/I18nContext";
import { Eye, EyeOff, Lock, MessageSquareLock } from "lucide-react";
import { useState } from "react";

const PIN_HASH_KEY = "privechat-pin-hash";
const PIN_VERIFIED_KEY = "privechat-pin-verified";

async function sha256(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function getPinHash(): string | null {
  return localStorage.getItem(PIN_HASH_KEY);
}

export function clearPinVerified(): void {
  sessionStorage.removeItem(PIN_VERIFIED_KEY);
}

export function isPinVerified(): boolean {
  return sessionStorage.getItem(PIN_VERIFIED_KEY) === "1";
}

export function markPinVerified(): void {
  sessionStorage.setItem(PIN_VERIFIED_KEY, "1");
}

export async function setPinHash(pin: string): Promise<void> {
  const hash = await sha256(pin);
  localStorage.setItem(PIN_HASH_KEY, hash);
}

export async function removePinHash(): Promise<void> {
  localStorage.removeItem(PIN_HASH_KEY);
}

interface PinScreenProps {
  mode: "verify" | "setup";
  onSuccess: () => void;
  onCancel?: () => void;
}

export default function PinScreen({
  mode,
  onSuccess,
  onCancel,
}: PinScreenProps) {
  const { t } = useTranslation();
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!pin) return;
    setLoading(true);
    setError(null);
    try {
      const hash = await sha256(pin);
      const stored = getPinHash();
      if (hash === stored) {
        markPinVerified();
        onSuccess();
      } else {
        setError(t("incorrectPin"));
        setPin("");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSetup = async () => {
    if (!pin || !confirmPin) return;
    if (pin !== confirmPin) {
      setError(t("pinsDoNotMatch"));
      setConfirmPin("");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await setPinHash(pin);
      markPinVerified();
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (mode === "verify") handleVerify();
    else handleSetup();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
      data-ocid="pin-screen"
    >
      <div className="bg-card border border-border p-8 w-full max-w-sm space-y-6 shadow-lg">
        {/* Brand */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 bg-accent/10 border border-accent/20 flex items-center justify-center">
            {mode === "verify" ? (
              <Lock className="h-6 w-6 text-accent" />
            ) : (
              <MessageSquareLock className="h-6 w-6 text-accent" />
            )}
          </div>
          <h1 className="font-display text-xl font-semibold text-foreground">
            {mode === "verify" ? t("enterYourPin") : t("createAPin")}
          </h1>
          {mode === "setup" && (
            <p className="text-sm text-muted-foreground">
              {t("createPinHint")}
            </p>
          )}
        </div>

        {/* PIN input */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label
              htmlFor="pin-input"
              className="text-sm text-muted-foreground"
            >
              {mode === "verify" ? t("enterYourPin") : t("createAPin")}
            </Label>
            <div className="relative">
              <Input
                id="pin-input"
                type={showPin ? "text" : "password"}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(null);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="••••••••"
                className="pr-10"
                autoFocus
                autoComplete="current-password"
                data-ocid="input-pin"
              />
              <button
                type="button"
                onClick={() => setShowPin((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPin ? t("hidePin") : t("showPin")}
                tabIndex={-1}
              >
                {showPin ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {mode === "setup" && (
            <div className="space-y-1.5">
              <Label
                htmlFor="confirm-pin-input"
                className="text-sm text-muted-foreground"
              >
                {t("confirmPin")}
              </Label>
              <div className="relative">
                <Input
                  id="confirm-pin-input"
                  type={showPin ? "text" : "password"}
                  value={confirmPin}
                  onChange={(e) => {
                    setConfirmPin(e.target.value);
                    setError(null);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="••••••••"
                  className="pr-10"
                  autoComplete="new-password"
                  data-ocid="input-confirm-pin"
                />
              </div>
            </div>
          )}

          {error && (
            <p
              className="text-sm text-destructive"
              role="alert"
              data-ocid="pin-error"
            >
              {error}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Button
            onClick={handleSubmit}
            disabled={loading || !pin || (mode === "setup" && !confirmPin)}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            data-ocid="btn-pin-submit"
          >
            {mode === "verify" ? t("unlock") : t("setPin")}
          </Button>
          {onCancel && (
            <Button
              variant="ghost"
              onClick={onCancel}
              className="w-full text-muted-foreground"
              data-ocid="btn-pin-cancel"
            >
              {t("cancel")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
