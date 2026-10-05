# AL RAYYAN PROJECT - AGENT STRICT CONSTRAINTS

You must strictly adhere to the following rules for all code written in this workspace:

1. **COLOR PALETTE**: ONLY use these 7 colors. Never invent or use any other color:
   - `#051625` (Dark Navy)
   - `#C2CE35` (Lime Accent)
   - `#000000` (Pure Black)
   - `#D0D0D0` (Border Gray)
   - `#FFFFFF` (Pure White)
   - `#006970` (Deep Teal)
   - `#959595` (Muted Gray)

2. **FONTS**:
   - Major Headings (`.major-heading`, `.main-heading`): `Bebas Neue`, sans-serif
   - Sub Headings (`.sub-heading`) and Body Text (`.body-text`, p, buttons, nav): `Outfit`, sans-serif

3. **CLASS-BASED REUSABILITY**:
   - Write clean, non-redundant CSS classes:
     - `.major-heading` (h1)
     - `.main-heading` (h2)
     - `.sub-heading` (h3)
     - `.body-text`, `.body-text-sm`
     - `.btn-teal`, `.btn-outline-teal`, `.btn-navy-arrow`
     - `.text-muted`, `.text-navy`, `.text-white`, `.text-teal`
     - `.site-container`, `.section-py`

4. **ASSET INTEGRITY**:
   - Only use assets from `assets/images/`, `assets/icons/`, `assets/svg/` provided by the user.

5. **HERO SLIDER SEQUENCE & LOGIC**:
   - Slide 1 active -> Banners 2 & 3 wait on right.
   - Slide 2 active -> ONLY Banner 3 waits on right.
   - Slide 3 active -> Banners 1 & 2 wait on right.
   - Vertical strip text must never clip at the bottom (clearance >= 48px).
   - Auto-slide with hover pause & click reset.
