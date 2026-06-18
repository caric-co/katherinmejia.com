---
name: KMakeup Platform
description: Editorial beauty platform for Colombian makeup artist Katherin Mejia
colors:
  warm-cream: "#F6F3EE"
  linen: "#F3ECE6"
  blush-accent: "#ECDFD4"
  peach: "#FBCFC6"
  dark-brown: "#2B2626"
  muted-brown: "#2B262699"
typography:
  display:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(2.5rem, 7vw, 5rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(1.75rem, 4vw, 2.5rem)"
    fontWeight: 400
    lineHeight: 1.2
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    letterSpacing: "0.1em"
rounded:
  none: "0px"
  pill: "900px"
spacing:
  section-sm: "4rem"
  section-md: "6rem"
  section-lg: "8rem"
  section-xl: "12rem"
components:
  button-primary:
    backgroundColor: "transparent"
    textColor: "{colors.dark-brown}"
    rounded: "{rounded.pill}"
    padding: "12px 32px"
  button-primary-hover:
    backgroundColor: "{colors.dark-brown}"
    textColor: "{colors.warm-cream}"
  input-default:
    backgroundColor: "transparent"
    textColor: "{colors.dark-brown}"
    rounded: "{rounded.none}"
    padding: "12px 0"
---

# Design System: KMakeup Platform

## 1. Overview

**Creative North Star: "The Editorial Sanctuary"**

A Colombian makeup artist's digital home that feels like flipping through a high-end fashion editorial, not scrolling a website. Every surface is warm, every transition deliberate, every interaction understated. The platform carries the same quiet confidence as the artist herself: expertise that doesn't need to shout.

The aesthetic draws directly from evamuah.com's Awwwards-winning approach: tonal layering instead of borders, massive serif headlines against restrained sans-serif body text, and photography that does the heavy lifting while the UI steps back. This is not a SaaS dashboard with cards and badges. It is a personal brand that happens to sell courses.

The system explicitly rejects: dark mode with neon accents, glassmorphism, gradient text, SaaS metric dashboards, identical card grids, heavy box borders around every element, and the default shadcn/Tailwind aesthetic of visible borders on all four sides of every container.

**Key Characteristics:**
- Tonal layering over borders (surfaces differentiate by background color, not outlines)
- Serif dominance at display scale, sans-serif restraint at body scale
- Photography-forward layouts where images fill their containers edge to edge
- Generous whitespace that varies by section (4rem to 12rem vertical rhythm)
- Pill-shaped interactive elements (buttons, badges, tags)
- Bottom-border-only form inputs (never box-bordered)

## 2. Colors

A tonal cream palette with no pure black or white. Every neutral is tinted warm.

### Primary
- **Dark Brown** (#2B2626): Primary text, button borders, active states. Never pure black; carries warmth at all sizes. Used at reduced opacity for secondary text (60%), borders (8%), and subtle dividers (5%).

### Neutral
- **Warm Cream** (#F6F3EE): Primary background. The page itself. Not white; distinctly warm when placed next to true white.
- **Linen** (#F3ECE6): Secondary surface. Testimonial sections, muted containers, alternate backgrounds. Creates depth without borders.
- **Blush Accent** (#ECDFD4): Tertiary surface. Callouts, highlights, selected states, accent backgrounds. The warmest neutral.
- **Peach** (#FBCFC6): Decorative accent. Used sparingly on peach-toned image overlays and hero backgrounds. Never on text.

### Named Rules
**The No-Box-Border Rule.** Containers, cards, and sections are never outlined with visible borders on all four sides. Depth comes from background color shifts (cream to linen to blush), not from outlines. The only visible borders are: (1) bottom-only on form inputs, (2) 1px outline on pill buttons, (3) subtle horizontal rules as section dividers, (4) top-border on the footer.

**The 8% Border Rule.** When a border IS needed (tables, dividers, separators), it is `rgba(43, 38, 38, 0.08)`, not the current `0.12`. At 8% opacity against the warm cream background, the line is felt more than seen.

## 3. Typography

**Display Font:** Playfair Display (with Georgia, serif fallback)
**Body Font:** Inter (with system-ui, sans-serif fallback)

**Character:** The pairing creates extreme contrast: massive, elegant serif headlines (up to 5rem) against small, precise sans-serif body text (~0.9375rem). The size difference does the work; weight stays at 400 for both. Headlines whisper through scale, not through boldness.

### Hierarchy
- **Display** (400, clamp(2.5rem, 7vw, 5rem), 1.1): Hero headlines, page titles. Playfair Display. The largest text on any screen.
- **Headline** (400, clamp(1.75rem, 4vw, 2.5rem), 1.2): Section headings. Playfair Display. Followed by an 8% opacity horizontal rule, not a heavy border.
- **Title** (600, 1.125rem, 1.4): Card headings, feature names, bold labels. Inter. The only text that uses semibold.
- **Body** (400, 0.9375rem, 1.6): Paragraphs, descriptions, table cells. Inter. Capped at 65ch line length on prose blocks.
- **Label** (500, 0.75rem, uppercase, 0.1em tracking): Form labels, category headers, navigation links, badges. Inter. Always uppercase. Always tracked.

### Named Rules
**The Weight Restraint Rule.** Font weight 700 (bold) is never used on headings. Playfair Display carries visual weight through its high stroke contrast at 400. Semibold (600) is reserved for titles and emphasis within body text. Bold exists only for interactive state changes (e.g. active nav item).

## 4. Elevation

This system is flat. No drop shadows, no box shadows, no blur effects (except the navigation backdrop). Depth is conveyed entirely through tonal layering: warm cream (#F6F3EE) sits behind linen (#F3ECE6), which sits behind blush (#ECDFD4). Three tonal steps create three visual planes without a single shadow.

The navigation is the sole exception: it uses a translucent background (`rgba(246, 243, 238, 0.85)`) with `backdrop-filter: blur(16px)` to float above content. This is purposeful, not decorative; it keeps nav text legible over full-bleed hero images.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. There are no hover shadows, no card elevation, no floating elements (except navigation). If something looks elevated, it is the wrong component for this system.

## 5. Components

### Buttons
- **Shape:** Full pill (border-radius: 900px)
- **Primary (ghost):** Transparent background, 1px solid #2B2626 border, uppercase Inter label at 0.8rem with 0.05em tracking. Padding: 12px 32px.
- **Hover:** Background fills to #2B2626, text inverts to #F6F3EE. Transition: 200ms ease-out.
- **Focus:** 2px ring at rgba(43, 38, 38, 0.25), offset 2px.
- **No filled variant exists as default.** The primary state is always ghost/outline. Filled only appears on hover.

### Inputs / Fields
- **Style:** Transparent background, NO side or top borders. Only a bottom border: 1px solid rgba(43, 38, 38, 0.15). No border-radius (0px).
- **Label:** Above the input, uppercase Inter at 0.75rem with 0.1em tracking, weight 500, color #2B2626 (full opacity, not muted).
- **Placeholder:** Same size as input text, color rgba(43, 38, 38, 0.4).
- **Focus:** Bottom border darkens to rgba(43, 38, 38, 0.6). No ring, no glow, no box-shadow.
- **Select dropdown:** Same bottom-border-only style. Chevron aligned right.
- **Textarea:** Bottom border only, resizable vertically.

### Cards / Containers
- **Corner Style:** Sharp (0px radius). Never rounded.
- **Background:** Differentiates from parent via tonal shift (cream to linen, or linen to blush). Never via border.
- **Shadow Strategy:** None. Flat always. See Elevation section.
- **Border:** Prohibited on all four sides. If a container needs separation, use a different background color.
- **Internal Padding:** 1.5rem to 2.5rem depending on content density.

### Tables
- **Style:** No outer border. No vertical column borders. Rows separated by horizontal lines at 8% opacity.
- **Header row:** Background: linen (#F3ECE6). Text: uppercase label style.
- **Cell padding:** 0.75rem to 1rem vertical, 1rem horizontal.
- **Hover:** Row background shifts to rgba(43, 38, 38, 0.03).

### Navigation
- **Desktop:** Fixed top, transparent background transitioning to frosted cream (backdrop-blur) on scroll. Logo left (serif wordmark), links right (uppercase label style).
- **Links:** No underlines at rest. Active: semibold weight. Hover: opacity 0.7.
- **Mobile:** Hamburger menu, full-screen overlay with centered links.

### FAQ Accordion
- **Style:** Numbered items (01/, 02/, etc.) with serif question text. No borders between items; whitespace provides separation.
- **Toggle:** Entire row is clickable. Answer slides in below. No icon rotation animation.

### Footer
- **Structure:** Top border (1px, 8% opacity) separating from content. Brand watermark in large serif at ~15% opacity. Copyright, Privacy Policy, Terms links in a single row.
- **Typography:** Label style for links, body style for copyright.

## 6. Do's and Don'ts

### Do:
- **Do** use tonal background shifts (cream → linen → blush) to create container separation instead of borders.
- **Do** keep form inputs as bottom-border-only: `border-bottom: 1px solid rgba(43, 38, 38, 0.15)` with transparent background and 0px border-radius.
- **Do** use 8% opacity (`rgba(43, 38, 38, 0.08)`) for any visible horizontal divider or table row separator.
- **Do** set the `--border` CSS variable to `rgba(43, 38, 38, 0.08)` and `--input` to `rgba(43, 38, 38, 0.15)` in the shadcn theme.
- **Do** use pill shape (900px radius) on all buttons and interactive badges.
- **Do** vary section spacing between 4rem and 12rem for rhythm; same padding everywhere is monotony.
- **Do** let photography be edge-to-edge within its container (object-fit: cover, no border-radius on images).

### Don't:
- **Don't** put `border border-border` (4-side box border) on cards, containers, or sections. This is the single most visible departure from evamuah.com's aesthetic. Containers use background color, not outlines.
- **Don't** use `ring-1 ring-foreground/10` on Card components. Remove the ring entirely; cards should be borderless by default.
- **Don't** use font-weight 700 or 800 on any heading. Playfair Display at 400 carries enough visual weight through its stroke contrast.
- **Don't** use dark mode. This is a warm, light, cream-based system; dark mode would destroy the tonal relationships.
- **Don't** add box-shadow to any component. Not on hover, not on focus, not on cards, not on buttons.
- **Don't** use `border-radius: 0.375rem` (rounded-md) on inputs. Inputs have no radius; they use bottom-border only.
- **Don't** use borders on table containers. Tables have internal horizontal rules between rows, not an outer box.
