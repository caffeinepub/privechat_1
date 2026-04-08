# Design Brief — PriveChat

## Purpose & Context
Secure one-on-one messaging app. Users authenticate via Internet Identity, browse a contact directory, and exchange text messages with persistent history. Auth-first hero/login page must feel modern, vibrant, and premium.

## Tone
Vibrant modern tech. Bold, trendy, eye-catching color palette with elevated visual presence. Confident, energetic, premium. Login page is the hero — designed to impress on first load. Chat UI maintains sophisticated color hierarchy with gradient accents and refined depth.

## Palette

| Token | OKLCH | Light Purpose | Dark Purpose |
|-------|-------|---------------|--------------|
| Primary | Light: 0.48 0.18 283 / Dark: 0.65 0.16 283 | Deep vivid purple — trust, authority, hero elements | Lifted purple — primary actions, headers |
| Secondary | Light: 0.72 0.2 52 / Dark: 0.78 0.18 52 | Warm orange-amber — trendy, secondary CTA | Vibrant orange — highlight, accent |
| Accent | Light: 0.68 0.22 200 / Dark: 0.72 0.2 200 | Bright teal-cyan — eye-catching, active states | Vivid teal — focus indicator, borders |
| Tertiary | 0.62 0.24 324 | Vibrant magenta — complexity, gradient elements |
| Background | Light: 0.97 0.02 240 / Dark: 0.12 0.02 240 | Soft off-white with warmth | Deep charcoal-blue |
| Card | Light: 0.96 0.01 0 / Dark: 0.18 0.01 0 | Pale frost | Elevated dark surface |
| Foreground | Light: 0.15 0.02 270 / Dark: 0.94 0 0 | Deep charcoal | Light neutral |
| Muted | Light: 0.88 0.04 0 / Dark: 0.22 0.01 0 | Subtle secondary | Muted surface |

## Typography
- **Display**: SpaceGrotesk 700 — headers, hero text, CTAs (geometric, confident, bold energy)
- **Body**: Inter 400/600 — messages, UI text, login form (precise, readable, contemporary)
- **Mono**: JetBrains Mono 400 — timestamps, metadata, code (technical clarity)

## Shape Language
- **Border Radius**: 6px (default), 12px (buttons), 0px (cards — sharp, modern)
- **Spacing**: Premium density with breathing room on hero elements
- **Shadows**: Elevated hierarchy — sm (subtle), md (medium depth), lg (hero focus), glow-accent (accent highlights)

## Structural Zones

| Zone | Background | Border | Purpose |
|------|-----------|--------|---------|
| Hero/Login | Gradient primary-magenta | None | Immersive hero — login form, CTA, brand presence |
| Header | Primary (deep purple) | Accent underline | User identity, settings, logout |
| Sidebar | Card (frost/elevated) | Accent accent/20 | Contact list with gradient active indicator |
| Chat Area | Background (soft warm) | None | Message bubbles with color blocking |
| Input Area | Card with border-top | Accent border | Text input with gradient send button |

## Component Patterns
- **Message Bubbles**: Current user right-aligned with gradient-to-br (primary→secondary), subtle shadow. Other user left-aligned, card bg with accent/20 border, shadow-md.
- **Contact List**: Active item gradient (primary→accent) with accent bar on left. Hover state uses secondary/10 bg. Accent border separates sections.
- **Buttons**: Primary uses gradient-primary (purple→magenta). Secondary uses solid secondary (orange). Accent uses solid accent (teal). All have hover shadows. CTA size = prominent.

## Motion
- **Transitions**: Smooth 0.3s cubic-bezier(0.4, 0, 0.2, 1) on all interactive elements. Gradient shifts on hover.
- **Entrance**: fade-in (0.4s) on hero page load, slide-up (0.4s) for contact list load.
- **Message Arrival**: Fade-in for new messages; no bounces.
- **Hover States**: Instant color shift + shadow elevation, no delay.

## Constraints
- Mobile-first responsive: hero optimized for vertical layout, contacts adapt at md breakpoint
- Dark mode fully supported: all colors re-tuned for contrast and mood (lighter purples, vibrant teals)
- WCAG AA+ contrast on all text + interactive elements
- No animation clutter during chat load; focus on content stability
- Gradient accents sparingly — hero page, buttons, active states only

## Signature Detail
Gradient-driven visual identity: primary-magenta gradient on hero CTA (login button), active contacts, and elevated surfaces. Accent teal border on received messages and section dividers creates modern color blocking. Zero border-radius on main cards paired with rounded button CTAs creates sophisticated contrast. Dark mode uses vibrant lifted hues (not inverted greys) for energetic premium feel.
