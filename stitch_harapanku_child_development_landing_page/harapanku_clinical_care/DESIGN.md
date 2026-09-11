---
name: Harapanku Clinical Care
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#414750'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#717781'
  outline-variant: '#c1c7d2'
  surface-tint: '#0b61a3'
  primary: '#0b61a2'
  on-primary: '#ffffff'
  primary-container: '#357abd'
  on-primary-container: '#00050f'
  inverse-primary: '#9fcaff'
  secondary: '#3b683d'
  on-secondary: '#ffffff'
  secondary-container: '#bcf0b9'
  on-secondary-container: '#416f43'
  tertiary: '#855000'
  on-tertiary: '#ffffff'
  tertiary-container: '#a76600'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d2e4ff'
  primary-fixed-dim: '#9fcaff'
  on-primary-fixed: '#001d36'
  on-primary-fixed-variant: '#00497e'
  secondary-fixed: '#bcf0b9'
  secondary-fixed-dim: '#a1d39e'
  on-secondary-fixed: '#002106'
  on-secondary-fixed-variant: '#235027'
  tertiary-fixed: '#ffddbb'
  tertiary-fixed-dim: '#ffb868'
  on-tertiary-fixed: '#2b1700'
  on-tertiary-fixed-variant: '#673d00'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2.5rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies clinical precision balanced with therapeutic warmth. Engineered specifically for anxious, time-constrained professional parents navigating child developmental milestones, the interface prioritizes immediate reassurance, total transparency, and reduced cognitive load.

The visual style merges modern healthcare minimalism with soft, human-centric organic accents. Surfaces are clean, uncluttered, and breathable, rejecting cold institutional tropes in favor of an inviting, sanctuary-like environment. The UI projects authority and safety through crisp typographic structure, paired with gentle, welcoming curves and serene color transitions that signal empathy, care, and developmental progress.

## Colors

The palette establishes a restorative, calm clinical atmosphere while providing uncompromising accessibility and conversion clarity.

- **Primary (`#357ABD`)**: A calming, deep medical blue. Used for primary navigation, clinical anchors, interactive indicators, links, and reassuring core accents.
- **Secondary (`#5E8D5E`)**: A balancing sage green. Represents physical and cognitive development, holistic health, milestone confirmations, and successful status badges.
- **Tertiary (`#E08A00`)**: A warm, optimistic developmental orange. Reserved strictly as an intentional conversion catalyst for high-priority actions (e.g., "Book Assessment", "Schedule Therapy Session", "Consult Pediatrician"). It must never be diluted by decorative application.
- **Neutral Dark (`#1E293B`)**: Deep slate navy. Forms the structural reading foundation, delivering sharp contrast without the harsh starkness of pure black.
- **Background & Canvas (`#FAFAF8` to `#F8FAFC`)**: Soft pearl and warmed clinical whites that prevent eye strain during late-night parental research. Elevated surfaces utilize pure `#FFFFFF` cards with subtle tinting.

## Typography

The type system blends friendly, geometric warmth with objective medical legibility. 

Headlines utilize a rounded geometric sans-serif to soften clinical clinical severity, greeting parents with empathy while maintaining professional authority. Body copy and operational labels rely on a systematic, neutral sans-serif designed for high legibility across dense screening results, therapist notes, and diagnostic schedules.

Line heights remain generous across all tiers to encourage effortless scanning for multi-tasking parents reading on mobile devices under low ambient lighting.

## Layout & Spacing

The layout model uses a responsive fluid grid optimized for rapid task execution and reassuring, unhurried content consumption:

- **Desktop (1024px+)**: 12-column grid, max content container width of 1200px, 2.5rem outer canvas margin, and 1.5rem gutters.
- **Tablet (768px - 1023px)**: 8-column grid with 2rem margins and 1.25rem gutters.
- **Mobile (< 768px)**: 4-column fluid layout with 1.25rem margins and 1rem gutters.

Generous padding standards ensure interface sections never feel congested. Medical histories, milestone checklists, and booking flows utilize `space-xl` between logical semantic groupings and `space-md` for standard component internals, maintaining a calm, uncrowded atmosphere throughout.

## Elevation & Depth

Depth is conveyed through soft, ambient multi-layer shadows and gentle tonal stacking rather than stark, heavy elevation.

- **Surface Baseline (0dp)**: Canvas base in `#FAFAF8` or `#F8FAFC`.
- **Level 1 (Card & Module Resting)**: Pure white `#FFFFFF` surface with an ambient clinical shadow: `0 4px 20px -2px rgba(30, 41, 59, 0.05)`. Low-contrast perimeter border: `1px solid rgba(74, 144, 226, 0.08)`.
- **Level 2 (Hover, Active Modals & Floating Menus)**: Elevated white `#FFFFFF` surface with an expanded diffused shadow: `0 12px 32px -4px rgba(30, 41, 59, 0.08)`.
- **Focus & Selection**: Soft, therapeutic focus rings using `0 0 0 4px rgba(74, 144, 226, 0.15)`, eliminating aggressive high-friction outlines.

## Shapes

The design system applies a deeply comforting rounded shape aesthetic that eliminates aggressive points and sharp corners. Standard components like cards, panels, and alert banners use `rounded-lg` (1rem) or `rounded-xl` (1.5rem), communicating protection, gentleness, and tactile safety. Small controls such as badges, tags, and small inputs anchor to `rounded` (0.5rem), maintaining structural coherence without losing clarity.

## Components

### Buttons
- **Primary Conversion CTA**: Solid warm developmental orange (`#E08A00`) with white text, `label-lg` weight, subtle warm glow shadow on hover, and full pill or `rounded-xl` curvature. Exclusively for direct appointments and urgent assessments.
- **Primary Clinical Action**: Deep medical blue (`#357ABD`) background with white text for standard flows (e.g., "Save Milestone", "View Therapy Plan").
- **Secondary / Soft Action**: Sage green tint (`rgba(94, 141, 94, 0.12)`) with `#5E8D5E` text for supporting or observational actions.
- **Ghost / Tertiary**: Neutral dark text with transparent background, gaining `rgba(30, 41, 59, 0.04)` on hover.

### Cards & Clinical Containers
- Background in crisp white (`#FFFFFF`) framed with 1px border `rgba(74, 144, 226, 0.1)` and `rounded-xl` corners.
- Internal padding is generous (`space-lg` to `space-xl`). Pediatric profile cards feature circular doctor avatars, warm sage tags for diagnostic specializations, and clear next-available slot timings.

### Form Inputs & Selectors
- Standard inputs use 48px height for thumb-friendly mobile input by active parents.
- Base background `#FFFFFF` with `1px solid #E2E8F0`, transitioning to a calming `#357ABD` border and diffused blue glow on focus.
- Floating labels using `label-md` prevent ambiguity when filling detailed developmental forms.

### Chips & Milestone Badges
- Soft status chips with 28px height, `rounded-md`, and gentle tonal fills:
  - Development On-Track: Light Sage (`#EBF3EB`) with dark green text (`#2D5A2D`).
  - Evaluation Recommended: Light Amber (`#FEF7EB`) with dark warm text (`#8F5500`).
  - Clinical Info: Light Blue (`#EFF6FC`) with primary blue text (`#23527C`).

### Interactive Checklists & Radio Selectors
- Milestone checklist items use generous touch targets (min 44px height) padded with `space-sm` to `space-md`. Checkboxes feature rounded corners (`4px`) and fill with Sage Green upon completion to reinforce positive developmental progress.