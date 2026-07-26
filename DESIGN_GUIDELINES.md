# Design Guidelines

These guidelines define the styling, colors, typography, buttons, and animations used across the Castiva Landing Page to ensure complete visual consistency.

---

## 1. Visual Theme & Colors

- **Primary Background**: Solid white (`#FFFFFF`) to maintain a clean layout.
- **Brand Colors**:
  - **Castiva Purple**: `#A128FF` (Used for key brand emphasis, highlighted terms, and gradient bases).
  - **Text Colors**: Deep slate (`#111827` or `text-slate-900`) for primary headings, and neutral gray (`#4B5563` or `text-slate-500`) for paragraphs.
  - **Gradients**: Smooth purples and index violet shades (`#A833FF` to `#7C00FF`).

---

## 2. Typography

- **Global Sans Font**: `Plus Jakarta Sans`
  - Utilized for main interface buttons, navigation, and paragraphs.
  - Headings: `font-extrabold tracking-tight text-slate-900`.
- **Display Serif Font**: `Instrument Serif` (Italic, normal weight)
  - Utilized exclusively for key highlighted brand terms in headings (e.g. *AI Enabled*, *Casting Directors*).
- **Secondary Display**: `Playfair Display`
  - Registered for banner styling.

---

## 3. Interactive Buttons

Both CTA buttons must strictly share identical heights (`h-[52px]` / `h-[56px]`) and width dimensions for balanced layout spacing.

- **Primary CTA: Discover**
  - Gradient backdrop (`radial-gradient(ellipse at bottom, rgba(55,55,55,1), rgba(0,0,0,1))`).
  - Subtle inset border (`box-shadow: inset 0 0 0 1px rgba(255,255,255,0.15)`).
- **Secondary CTA: Sign Up Now & Login**
  - WebGL dynamic aurora shader background with purple theme.
  - White volumetric under-glow (`bg-purple-500/30 blur-[60px]`).
  - Translucent border-glow shell (`border-white/40 shadow-[inset_0_2px_12px_rgba(255,255,255,0.7)]`).

---

## 4. Layout Structure

- **Section Container**: `max-w-7xl mx-auto px-6 py-20`.
- **Bento Grids**:
  - Asymmetric structures (e.g., Col-span mixing of 2 and 1 in `grid-cols-3` or `grid-cols-4`).
  - Soft boundaries (`border border-slate-100 bg-slate-50/50 rounded-3xl p-8`).
  - Hover effects: Subtle lift (`hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/5 duration-300`).

---

## 5. Animations

- **GSAP & ScrollTrigger**:
  - Heading entry: Blur reveal on load (`filter: blur(12px) -> blur(0px)`, `opacity: 0 -> 1`, `y: 35 -> 0`).
  - Bento cards entry: Scroll-triggered staggered fade-in blur reveal.
- **Auto-Scrolling Marquee**:
  - Infinite right-to-left marquee translation (`translateX(0%) -> translateX(-50%)`) at a linear pace.
  - Separators: `star-icon.png` (`w-12 h-12 inline-block mx-12 align-middle`).
