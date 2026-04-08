import { useTranslation } from "@/contexts/I18nContext";
import { MessageSquare, Shield, Zap } from "lucide-react";

export default function EmptyState() {
  const { t } = useTranslation();
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center bg-background gap-6 p-8 relative overflow-hidden"
      data-ocid="empty-state-chat"
    >
      {/* Subtle background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, oklch(var(--primary) / 0.04) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-center gap-5 max-w-xs text-center animate-scale-in">
        {/* Icon */}
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center shadow-lg glow-primary">
            <MessageSquare className="h-9 w-9 text-white" strokeWidth={1.5} />
          </div>
          {/* Decorative ring */}
          <div className="absolute -inset-2 rounded-3xl border-2 border-primary/20 animate-pulse" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h2 className="font-display text-xl font-bold text-foreground">
            {t("noConversationSelected")}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t("noConversationSelectedHint")}
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex items-center gap-2 flex-wrap justify-center mt-1">
          <div className="flex items-center gap-1.5 bg-primary/8 border border-primary/20 rounded-full px-3 py-1.5">
            <Shield className="h-3 w-3 text-primary" />
            <span className="text-xs text-primary font-medium">
              {t("featurePrivate")}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-accent/8 border border-accent/20 rounded-full px-3 py-1.5">
            <Zap className="h-3 w-3 text-accent" />
            <span className="text-xs text-accent font-medium">
              {t("featureEncrypted")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
