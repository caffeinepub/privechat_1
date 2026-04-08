import Header from "@/components/Header";
import PinScreen, {
  getPinHash,
  isPinVerified,
  markPinVerified,
} from "@/components/PinScreen";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type Language, useTranslation } from "@/contexts/I18nContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import {
  Loader2,
  MessageSquareLock,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  type ReactNode,
  Suspense,
  lazy,
  useEffect,
  useRef,
  useState,
} from "react";
import { createActor } from "./backend";

/* ─── Lazy ChatPage ───────────────────────────────────── */
const ChatPage = lazy(() => import("@/pages/ChatPage"));

/* ─── Preference Hydrator ─────────────────────────────── */
// Completely fire-and-forget: loads once per identity session, applies defaults
// on any error, and NEVER causes the gate to loop or re-render in a bad state.
function PreferenceHydrator() {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { identity } = useInternetIdentity();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useTranslation();

  // Use refs for current theme/language so the effect can read the latest
  // values without listing them as dependencies (avoids re-running on every
  // theme/language change after hydration).
  const themeRef = useRef(theme);
  const languageRef = useRef(language);
  const toggleThemeRef = useRef(toggleTheme);
  const setLanguageRef = useRef(setLanguage);
  themeRef.current = theme;
  languageRef.current = language;
  toggleThemeRef.current = toggleTheme;
  setLanguageRef.current = setLanguage;

  // Track per-identity whether we've already run — stored in a ref so it NEVER
  // triggers a re-render and NEVER gets reset mid-cycle.
  const ranForPrincipalRef = useRef<string | null>(null);

  useEffect(() => {
    if (!actor || actorFetching || !identity) return;

    const principalStr = identity.getPrincipal().toString();

    // Already hydrated for this identity — don't run again.
    if (ranForPrincipalRef.current === principalStr) return;

    // Mark as run immediately (before the async call) so concurrent effect
    // invocations don't double-fire.
    ranForPrincipalRef.current = principalStr;

    // Fire-and-forget: errors are swallowed safely — defaults are already set
    // by the context providers reading from localStorage.
    actor
      .getUserPreferences()
      .then((prefs) => {
        if (!prefs) return; // No preferences saved yet — keep defaults.

        if (
          (prefs.theme === "light" || prefs.theme === "dark") &&
          prefs.theme !== themeRef.current
        ) {
          toggleThemeRef.current();
        }
        if (
          (prefs.language === "en" ||
            prefs.language === "el" ||
            prefs.language === "ro") &&
          prefs.language !== languageRef.current
        ) {
          setLanguageRef.current(prefs.language as Language);
        }
      })
      .catch(() => {
        // Preferences are optional — silently keep defaults.
        // Do NOT reset ranForPrincipalRef: we do NOT want to retry in a loop.
      });
  }, [actor, actorFetching, identity]);

  return null;
}

/* ─── App Shell (wraps all authenticated routes) ─────── */
function AuthenticatedShell() {
  const { identity } = useInternetIdentity();
  const { user } = useCurrentUser();
  const [pinVerified, setPinVerified] = useState<boolean>(() =>
    isPinVerified(),
  );

  if (!identity) return <Navigate to="/login" />;

  const pinHash = getPinHash();

  if (pinHash && !pinVerified) {
    return (
      <PinScreen
        mode="verify"
        onSuccess={() => {
          markPinVerified();
          setPinVerified(true);
        }}
      />
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      <PreferenceHydrator />
      <Header currentUser={user} />
      <div className="flex flex-1 overflow-hidden">
        <ProfileGate>
          <Outlet />
        </ProfileGate>
      </div>
    </div>
  );
}

/* ─── Profile Setup Gate ──────────────────────────────── */
// Single responsibility: is the user registered? If yes → show children.
// If no → show the registration form. Completely independent of PreferenceHydrator.
function ProfileGate({ children }: { children: ReactNode }) {
  const { actor, isFetching: actorFetching } = useActor(createActor);
  const { identity } = useInternetIdentity();
  const { user, isLoading, isFetched } = useCurrentUser();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Show registration form only when:
  // 1. We have an identity (authenticated)
  // 2. Not currently loading (actor ready, query not in flight)
  // 3. Query has completed at least once (isFetched)
  // 4. No user was found for this principal
  const needsRegistration =
    !!identity && !isLoading && isFetched && user === null;

  const handleSave = async () => {
    if (!actor || !identity || !name.trim() || saving) return;
    setError("");
    setSaving(true);
    try {
      await actor.registerUser(name.trim());
      // Cancel any in-flight queries for currentUser so a background refetch
      // can't race with and overwrite the data we're about to write.
      const principal = identity.getPrincipal();
      await queryClient.cancelQueries({
        queryKey: ["currentUser", principal.toString()],
      });
      // Optimistically write the new user directly into the React Query cache.
      // staleTime: 30_000 in useCurrentUser ensures this won't be refetched for
      // 30 seconds, giving the backend update call time to settle.
      const newUser = { principal, displayName: name.trim() };
      queryClient.setQueryData(["currentUser", principal.toString()], newUser);
      // Background-invalidate the users list so the directory is fresh.
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (err) {
      console.error("Failed to register user:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  // Show spinner while actor is initialising OR while the identity exists but
  // the user query hasn't completed its first fetch yet.
  if (actorFetching || (!!identity && isLoading && !isFetched)) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center animate-pulse-glow">
            <MessageSquareLock className="h-5 w-5 text-white" />
          </div>
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (needsRegistration) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background p-6">
        <div
          className="bg-card border border-border shadow-lg p-8 w-full max-w-sm space-y-5 rounded-xl"
          data-ocid="profile-setup-modal"
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <MessageSquareLock className="h-4 w-4 text-white" />
            </div>
            <span className="font-display font-bold text-base text-foreground">
              PriveChat
            </span>
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-foreground">
              {t("setDisplayName")}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {t("displayNameHint")}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="display-name">{t("setDisplayName")}</Label>
            <Input
              id="display-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("displayNamePlaceholder")}
              onKeyDown={async (e) => {
                if (e.key === "Enter") await handleSave();
              }}
              disabled={saving}
              data-ocid="input-display-name"
            />
            {error && (
              <p className="text-destructive text-sm mt-1" role="alert">
                {error}
              </p>
            )}
          </div>
          <Button
            onClick={handleSave}
            disabled={!name.trim() || saving}
            className="w-full btn-primary rounded-lg"
            data-ocid="btn-save-profile"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {t("continue")}
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

/* ─── Floating Orb ────────────────────────────────────── */
interface OrbProps {
  className: string;
  style?: React.CSSProperties;
}
function Orb({ className, style }: OrbProps) {
  return (
    <div className={`orb ${className}`} style={style} aria-hidden="true" />
  );
}

/* ─── Feature Badge ───────────────────────────────────── */
interface FeatureBadgeProps {
  icon: React.ReactNode;
  label: string;
  delay: string;
}
function FeatureBadge({ icon, label, delay }: FeatureBadgeProps) {
  return (
    <div
      className="glass flex items-center gap-2 px-4 py-2.5 rounded-full animate-slide-up"
      style={{ animationDelay: delay, animationFillMode: "both" }}
    >
      <span className="text-white/80">{icon}</span>
      <span className="text-white/90 text-sm font-medium">{label}</span>
    </div>
  );
}

/* ─── Login Page ──────────────────────────────────────── */
function LoginPage() {
  const { login, identity, isLoggingIn } = useInternetIdentity();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const bgRef = useRef<HTMLDivElement>(null);

  if (identity) return <Navigate to="/chat" />;

  const handleLogin = async () => {
    try {
      await login();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (msg === "User is already authenticated") {
        queryClient.clear();
      }
    }
  };

  return (
    <div
      ref={bgRef}
      className="flex-1 relative flex items-center justify-center overflow-hidden"
      data-ocid="login-page"
      style={{
        background: "var(--gradient-hero)",
      }}
    >
      {/* Hero background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage:
            "url('/assets/generated/login-hero-bg.dim_1400x900.jpg')",
        }}
        aria-hidden="true"
      />

      {/* Mesh gradient overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "var(--gradient-mesh)" }}
        aria-hidden="true"
      />

      {/* Animated orbs */}
      <Orb
        className="orb-1 w-96 h-96 -top-16 -left-20"
        style={{ background: "oklch(0.48 0.22 283 / 0.5)" }}
      />
      <Orb
        className="orb-2 w-80 h-80 top-1/4 -right-16"
        style={{ background: "oklch(0.60 0.26 324 / 0.45)" }}
      />
      <Orb
        className="orb-3 w-72 h-72 bottom-10 left-1/3"
        style={{ background: "oklch(0.66 0.24 200 / 0.4)" }}
      />

      {/* Content layout */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 py-12">
        {/* Left: Hero text */}
        <div
          className="flex-1 text-center lg:text-left space-y-6 animate-slide-up"
          style={{ animationFillMode: "both" }}
        >
          {/* Logo */}
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-xl glow-primary">
              <MessageSquareLock
                className="h-6 w-6 text-white"
                strokeWidth={2}
              />
            </div>
            <span className="font-display font-bold text-2xl text-white tracking-tight">
              PriveChat
            </span>
          </div>

          {/* Headline */}
          <div className="space-y-2">
            <h1 className="font-display font-bold text-5xl lg:text-6xl xl:text-7xl leading-[1.05] text-white">
              <span
                className="inline-block"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.85 0.18 52) 0%, oklch(0.85 0.22 324) 50%, oklch(0.85 0.2 200) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {t("loginHeroHeadline")}
              </span>
            </h1>
            <p className="text-lg lg:text-xl text-white/70 max-w-lg leading-relaxed">
              {t("loginHeroSubtitle")}
            </p>
          </div>

          {/* Feature badges */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
            <FeatureBadge
              icon={<Shield className="h-3.5 w-3.5" />}
              label={t("loginFeatureEncrypted")}
              delay="0.1s"
            />
            <FeatureBadge
              icon={<Zap className="h-3.5 w-3.5" />}
              label={t("loginFeatureFast")}
              delay="0.2s"
            />
            <FeatureBadge
              icon={<Sparkles className="h-3.5 w-3.5" />}
              label={t("loginFeatureDecentralized")}
              delay="0.3s"
            />
          </div>
        </div>

        {/* Right: Glass sign-in card */}
        <div
          className="w-full max-w-sm lg:max-w-md animate-scale-in"
          style={{ animationDelay: "0.15s", animationFillMode: "both" }}
        >
          <div className="glass-card rounded-3xl p-8 shadow-xl space-y-8">
            {/* Card header */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl gradient-primary mx-auto flex items-center justify-center shadow-lg glow-primary mb-4">
                <MessageSquareLock
                  className="h-8 w-8 text-white"
                  strokeWidth={1.75}
                />
              </div>
              <h2 className="font-display text-2xl font-bold text-white">
                {t("loginWelcomeBack")}
              </h2>
              <p className="text-white/60 text-sm leading-relaxed">
                {t("loginSubtitle")}
              </p>
            </div>

            {/* Sign in button */}
            <div className="space-y-4">
              <button
                type="button"
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="w-full btn-gradient-hero flex items-center justify-center gap-2 text-base"
                data-ocid="btn-login"
              >
                {isLoggingIn ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <MessageSquareLock className="h-5 w-5" />
                )}
                {t("signIn")}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/15" />
                <span className="text-white/40 text-xs font-medium">
                  {t("loginSecuredBy")}
                </span>
                <div className="flex-1 h-px bg-white/15" />
              </div>

              {/* ICP branding */}
              <div className="flex items-center justify-center gap-2 py-1">
                <div className="flex items-center gap-2 glass rounded-xl px-4 py-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#29abe2] to-[#522785]" />
                  <span className="text-white/70 text-xs font-medium">
                    {t("loginInternetIdentity")}
                  </span>
                </div>
              </div>
            </div>

            {/* Privacy note */}
            <p className="text-center text-white/40 text-xs leading-relaxed">
              {t("loginPrivacy")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Chat route wrapper ──────────────────────────────── */
function ChatRoute() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center animate-pulse-glow">
              <MessageSquareLock className="h-5 w-5 text-white" />
            </div>
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        </div>
      }
    >
      <ChatPage />
    </Suspense>
  );
}

/* ─── Routes ──────────────────────────────────────────── */
const rootRoute = createRootRoute({
  component: () => (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <Outlet />
    </div>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const authenticatedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "authenticated",
  component: AuthenticatedShell,
});

const indexRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/",
  component: () => <Navigate to="/chat" />,
});

const chatRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: "/chat",
  component: ChatRoute,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  authenticatedRoute.addChildren([indexRoute, chatRoute]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
