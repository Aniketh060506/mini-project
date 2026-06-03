## UI Overhaul Plan — Break the Generic Box Pattern

### 1. **Home Page — Immersive Hero + Organic Layout**
- Hero: Full-width with animated gradient mesh background, asymmetric text alignment (left-aligned), floating 3D-like device illustration
- Stats: Horizontal scrolling ticker/ribbon strip instead of 3 boxes
- Features: Staggered bento grid (2 large + 2 small) with icon backgrounds bleeding out, not contained in boxes
- CTA: Angled/diagonal section break, not a centered box

### 2. **Registration — Multi-Step Wizard**
- Replace single long form with a **4-step wizard** (Personal → Emergency → Device → Trek)
- Animated step indicator with connecting line
- Each step shows only 2-3 fields — feels light, not overwhelming
- Side panel showing a live "preview card" of their ID being built as they fill fields
- Floating progress percentage

### 3. **Dashboard — Bento Grid Layout**
- Search bar with floating pill design
- Tourist profile as a **horizontal banner card** (not a vertical list)
- Telemetry in a **bento grid**: map takes 2 columns, gauges are smaller varied tiles
- SOS button floats as a fixed bottom-right FAB, not inline
- Gauges redesigned as **horizontal bar meters** with animated fills instead of circular

### 4. **Verify Page — Split Screen**
- Left: Scanner/input area with large visual shield icon
- Right: Verification result with animated checkmark reveal
- Timeline-style verification steps shown as they happen

### 5. **Design Tokens**
- Add gradient mesh backgrounds, soft blob shapes
- Organic border-radius (larger, more varied)
- Subtle grain texture overlay
- More whitespace, breathing room
