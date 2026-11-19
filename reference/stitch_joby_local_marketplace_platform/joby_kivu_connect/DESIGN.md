---
name: Joby Kivu Connect
colors:
  surface: '#f6f9fe'
  surface-dim: '#d7dadf'
  surface-bright: '#f6f9fe'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f4f9'
  surface-container: '#ebeef3'
  surface-container-high: '#e5e8ed'
  surface-container-highest: '#dfe3e8'
  on-surface: '#181c20'
  on-surface-variant: '#424654'
  inverse-surface: '#2d3135'
  inverse-on-surface: '#eef1f6'
  outline: '#737785'
  outline-variant: '#c3c6d6'
  surface-tint: '#0856cf'
  primary: '#0041a2'
  on-primary: '#ffffff'
  primary-container: '#0b57d0'
  on-primary-container: '#ced9ff'
  inverse-primary: '#b2c5ff'
  secondary: '#006688'
  on-secondary: '#ffffff'
  secondary-container: '#00c1fd'
  on-secondary-container: '#004b65'
  tertiary: '#005237'
  on-tertiary: '#ffffff'
  tertiary-container: '#006d4a'
  on-tertiary-container: '#65f2b5'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#b2c5ff'
  on-primary-fixed: '#001847'
  on-primary-fixed-variant: '#0040a1'
  secondary-fixed: '#c2e8ff'
  secondary-fixed-dim: '#75d1ff'
  on-secondary-fixed: '#001e2b'
  on-secondary-fixed-variant: '#004d67'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f6f9fe'
  on-background: '#181c20'
  surface-variant: '#dfe3e8'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '800'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 26px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system powers a vibrant local marketplace and business directory crafted for the economic ecosystem of Goma and the Democratic Republic of Congo. The interface embodies reliability, community trust, dynamic commerce, and accessibility. It solves regional operational challenges—such as variable mobile network speeds and high mobile browsing usage—by presenting information crisply with immediate contact channels.

### Design Movement & Aesthetic
The system adopts **Modern Utility with Soft Dimensionality**. It balances clean, accessible structural clarity with tactile cues:
- **Optimism & Trust:** Electric cobalt and energetic cyan paired with soft neutral backgrounds to avoid eye fatigue under direct sunlight.
- **Action-Driven Clarity:** High-contrast contact actions (WhatsApp direct messaging, phone dialing, verified establishment badges) stand out effortlessly in dense feeds.
- **Micro-Delight:** Refined micro-interactions, subtle boundary rings, and clean status indicators signaling genuine, verified community actors.

## Colors

The color palette draws directly from the brand marks: deep authoritative cobalt blues, electric dynamic cyans, and crisp trust-building neutrals.

### Palette Architecture
- **Primary (`#0B57D0`):** Anchors brand presence, top navigation headers, primary submission flows, and interactive text links.
- **Secondary (`#00C2FF`):** Energetic cyan accent utilized for interactive highlights, active tab indicators, promotional badges, and visual focal points.
- **Tertiary (`#10B981`):** Success green, used strategically for verified merchant indicators, active online statuses, and WhatsApp conversion triggers.
- **Neutral Surface (`#F4F7FC`):** Soft, clean, low-strain cool canvas replacing pure stark white backgrounds. High-contrast pure white (`#FFFFFF`) is reserved for foreground cards and modal panels.
- **Text & Borders:** Text primary sits at `#0F172A` (deep slate navy) for contrast meeting WCAG AAA requirements, while structural lines use `#E2E8F0`.

## Typography

The design system specifies **Plus Jakarta Sans** across all hierarchies. Its geometric construction, broad apertures, and contemporary letterforms ensure maximum legibility across entry-level Android devices and high-DPI desktop displays alike.

### Typographic Rules
- **Numerical & Price Clarity:** Amounts and prices (USD / CDF) must always be formatted in `headline-sm` or `label-lg` with `fontWeight: 700` to avoid misinterpretation in commercial listings.
- **Headings:** Tight negative tracking on display and headline variants commands authority and prevents orphan words in dense multilingual environments (French and Swahili).
- **Labels & Meta:** Verified badges, publication timestamps, and location tags (e.g., "Goma - Birere", "Himbi") use `label-md` and `label-sm` with slight positive tracking for crisp glanceability.

## Layout & Spacing

The layout model is a responsive fluid grid optimized for both compact single-hand mobile interactions and data-dense enterprise portals.

### Layout System
- **Mobile (under 768px):** 4-column layout with `1rem` margins and `1rem` gutters. Crucial touch points sit within the natural thumb zone. Navigation relies on an app-like bottom navigation dock with elevated action triggers.
- **Tablet (768px – 1024px):** 8-column layout with `1.5rem` margins. Split-pane layout for listing feeds and preview panels.
- **Desktop (1024px+):** 12-column layout capped at a max-width of `1280px` centered canvas, with `2.5rem` outer margins. Accommodates contextual multi-filter sidebars alongside dense multi-card grid layouts.

### Vertical Rhythm
Component heights and spacing scale on a 4px/8px modular scale. Dense listing tables use `space-xs` and `space-sm` for table-cell padding to display maximum listings per view.

## Elevation & Depth

Visual hierarchy leverages a hybrid approach combining **soft ambient daylight shadows** with **subtle structural borders**. This ensures tactile depth without requiring heavy GPU rendering on low-tier mobile hardware.

### Elevation Scales
- **Level 0 (Flat Canvas):** Surfaces colored `#F4F7FC` with zero elevation.
- **Level 1 (Cards & Data Cells):** Pure white background (`#FFFFFF`) with a `1px` stroke in `#E2E8F0` and an ultra-subtle tinted shadow: `box-shadow: 0 1px 3px rgba(11, 87, 208, 0.04), 0 1px 2px rgba(15, 23, 42, 0.03)`.
- **Level 2 (Interactive Hover & Dropdowns):** Subtle lift using `box-shadow: 0 4px 12px rgba(11, 87, 208, 0.08), 0 2px 4px rgba(15, 23, 42, 0.04)`.
- **Level 3 (Sticky Action Bars & Modals):** Crisp floating elements with `box-shadow: 0 12px 28px -4px rgba(11, 87, 208, 0.12), 0 6px 10px rgba(15, 23, 42, 0.06)`.

No heavy black drop shadows are allowed; all elevations incorporate a minute trace of the primary blue hue to maintain atmospheric cohesion.

## Shapes

The design system implements a balanced **Level 2 Roundedness** standard (`rounded-md: 0.5rem / 8px`, `rounded-lg: 1rem / 16px`, `rounded-xl: 1.5rem / 24px`).

### Geometric Harmony
- **Cards and Modals:** Utilize `1rem` (16px) corner rounding to convey approachable, modern craftsmanship inspired by the fluid curved tail of the logo.
- **Buttons and Inputs:** Utilize `0.5rem` (8px) for compact, tactile form controls.
- **Pills and Indicators:** Badges, category pills, and quick action chips use full rounded capsules (`9999px`) to immediately distinguish them from primary cards and containers.
- **Avatar & Company Icons:** Business logos use `0.75rem` (12px) rounded containers with a `1px` subtle outline to stand distinct from user circle avatars.

## Components

### 1. Buttons & Call to Actions
- **Primary Button ("Publier une annonce"):** Solid primary `#0B57D0` fill, white bold typography, `0.5rem` radius, with subtle hover lift and an active scale-down (`0.98`).
- **Direct Connect Buttons (WhatsApp & Phone):**
  - **WhatsApp CTA:** Tertiary background `#10B981` or tinted surface `#ECFDF5` with `#065F46` label and embedded WhatsApp glyph.
  - **Call Direct:** Tinted primary `#EBF3FE` with `#0B57D0` text and phone icon.
- **Secondary / Ghost:** Outlined with `1.5px` border in `#CBD5E1`, transparent background, dark slate text.

### 2. Cards (Listings & Business Directories)
- **Product & Job Cards:** Built on a white Level 1 container. Image aspect ratio of 4:3 with rounded top edges, bottom container hosting title, price badge, location snippet, and publisher verified pill.
- **Company Profiles:** Features header banner with overlapping square-rounded logo, company name, verification tick, rating star, and immediate dual contact triggers.

### 3. Chips & Category Filters
- Filter chips sit in horizontal scroll containers on mobile.
- Inactive state: `#FFFFFF` fill, `#E2E8F0` border, `#475569` text.
- Active state: `#0B57D0` background, `#FFFFFF` text, paired with an energetic cyan `#00C2FF` accent dot.

### 4. Verified Badges & Trust Elements
- **Verified Entity Badge:** Pill badge using deep cobalt blue `#0B57D0` with a sharp white checkmark icon and "Vérifié" label.
- **Pro / Enterprise Badge:** Gold-tinted gradient or cyan accent `#00C2FF` with dark label.

### 5. Input Fields & Search Bars
- **Global Search Bar:** Prominent search input with left-aligned search icon, placeholder with dynamic hints ("Rechercher un emploi, un service, un bien à Goma..."), and location selector dropdown integration.
- **Form Controls:** 44px min touch height, `#F8FAFC` background with `#E2E8F0` border, switching to `#0B57D0` ring on focus with `0 0 0 3px rgba(11, 87, 208, 0.15)`.

### 6. Admin & Management Tables
- Clean tabular rows with alternating hover states (`#F8FAFC`), sticky header, inline status chips (En attente, Validé, Expiré), and compact icon-only action menus.