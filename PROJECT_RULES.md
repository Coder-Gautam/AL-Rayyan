# AL RAYYAN PROJECT - STRICT DEVELOPMENT RULES & DESIGN SYSTEM

## 1. STRICT COLOR PALETTE (NEVER USE ANY OTHER COLORS)
Under no circumstance should any color outside this exact 7-color palette be used:
- `--c-dark-navy`: `#051625` (Deep Navy / Backgrounds / Dark Headings)
- `--c-lime`:      `#C2CE35` (Accent Lime / Arrow Boxes / Badges / Hover Highlights)
- `--c-black`:     `#000000` (Pure Black)
- `--c-border`:    `#D0D0D0` (Border Gray / Divider Lines / Inputs)
- `--c-white`:     `#FFFFFF` (White / Backgrounds / Light Text)
- `--c-teal`:      `#006970` (Brand Teal / Primary CTA Buttons / Active States)
- `--c-muted`:     `#959595` (Muted Gray / Placeholders / Secondary Details)

## 2. STRICT TYPOGRAPHY
Only two font families are used across the entire website:
- **Major Headings (`h1`, `.major-heading`)**: `Bebas Neue`, sans-serif
- **Main Headings (`h2`, `.main-heading`)**: `Bebas Neue`, sans-serif
- **Sub Headings (`h3`, `.sub-heading`)**: `Outfit`, sans-serif (all caps, wide tracking)
- **Body & UI Text (`body`, `p`, `.body-text`, buttons, nav)**: `Outfit`, sans-serif

## 3. CLASS-BASED REUSABLE DESIGN SYSTEM (ZERO REDUNDANCY)
Write modular, human-grade, utility & component CSS instead of duplicating inline or ad-hoc section styles:
- **Headings**:
  - `.major-heading` (h1, Bebas Neue, responsive clamp 52px-78px, line-height 0.96)
  - `.main-heading` (h2, Bebas Neue, responsive clamp 36px-56px, line-height 1.05)
  - `.sub-heading` (h3, Outfit, 15px-19px, letter-spacing 3.5px, uppercase, font-weight 600)
- **Body Text**:
  - `.body-text` (Outfit, 14.5px-15px, line-height 1.6)
  - `.body-text-sm` (Outfit, 13px, line-height 1.5)
  - `.text-muted` (color: var(--c-muted))
  - `.text-navy` (color: var(--c-dark-navy))
  - `.text-white` (color: var(--c-white))
  - `.text-teal` (color: var(--c-teal))
- **Buttons**:
  - `.btn-teal` (Background #006970, text #FFFFFF, border-radius 4px)
  - `.btn-outline-teal` (Border #006970, text #006970, border-radius 4px)
  - `.btn-navy-arrow` (Dark navy button with #C2CE35 lime arrow square box)
- **Containers**:
  - `.site-container` (max-width 1440px, padding-inline: 40px / 20px mobile)
  - `.section-py` (consistent vertical section padding: 80px 0)

## 4. ASSET INTEGRITY
- Only use images, SVGs, and icons provided directly by the user in `assets/images/`, `assets/icons/`, `assets/svg/`.
- Never guess or use random placeholder images or icons from third-party sources.

## 5. INTERACTION & SLIDER RULES
- **Header Nav**: Both `on hover` and `on active` get the soft blue tint (`#EFF6F8`) and bottom rounded `#006970` teal tab bar.
- **Hero Slider Waiting Sequence**:
  - Slide 1 active -> Banners 02 & 03 wait on right.
  - Slide 2 active -> ONLY Banner 03 waits on right.
  - Slide 3 active -> Banners 01 & 02 wait on right.
- **Vertical Strip Text**: Must use `writing-mode: vertical-rl; transform: rotate(180deg);` with minimum `48px` bottom clearance so text is NEVER cut off.
- **Auto-Slide**: 5-second interval, pause on hover, reset on manual click.
- **Expanding Animation**: Slides transition smoothly from right preview strip to full screen ("chote se badi hoti hui").
