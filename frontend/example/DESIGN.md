# Design System: High-End Sports Editorial

## 1. Overview & Creative North Star

### Creative North Star: "The Technical Director"
This design system moves away from the "casual gamer" aesthetic and toward a high-end, professional management suite. The vision is to mirror the precision of a top-tier football club's analytical software while maintaining the cinematic energy of world-class sports broadcasting. 

We break the "template" look by embracing **Intentional Asymmetry**. Rather than a rigid, centered grid, the layout utilizes varying column widths and overlapping "hero" elements (like player renders) that break the boundaries of their containers. This creates a sense of depth and motion, moving beyond the flat, static feeling of standard web dashboards.

---

## 2. Colors

The color palette is rooted in a deep, nocturnal foundation, allowing high-performance stats and vibrant accents to pierce through the dark.

*   **Foundation:** Deep Charcoal (`surface`: #0e0e0e) provides a high-contrast base.
*   **The Signature Accent:** Vibrant Green (`primary`: #bcff5f) is reserved strictly for "Success States"—positive stat growth, elite attributes, and primary actions.
*   **The Depth Secondary:** A sophisticated Purple/Blue (`secondary`: #af8dfe) is used for "Atmospheric Depth," primarily through subtle gradients and glassmorphism backdrops.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to section off content. Traditional borders are "clutter." Boundaries must be defined solely through background color shifts. For example:
*   Use `surface-container-low` for a main feed area.
*   Place a `surface-container-highest` card within that area to denote a focused element.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of materials. 
1.  **Bottom Layer:** `surface` (The pitch).
2.  **Mid Layer:** `surface-container-low` (General UI sections).
3.  **Top Layer:** `surface-container-highest` (Interactive cards and active tabs).

### Glass & Gradient Implementation
Floating elements (like player stat modals) should use a semi-transparent `surface-variant` with a 12px-20px backdrop blur. Main CTAs should not be flat; apply a subtle linear gradient from `primary` to `primary-container` at a 145° angle to give the element a "machined" metallic finish.

---

## 3. Typography

The typography strategy pairs aggressive, athletic headlines with high-performance, legible body text.

*   **Display & Headlines (Epilogue):** Chosen for its geometric weight. Use `display-lg` for player names and large scorelines. The tight kerning and bold weights mimic the "kit name" feel of professional jerseys.
*   **Body & Labels (Manrope):** A modern sans-serif with a high X-height. This is the "workhorse" for dense statistical data, ensuring that even at `label-sm`, player attributes remain crystal clear.

**The Hierarchy Note:** Headlines should use `on-surface` (pure white), while secondary metadata should use `on-surface-variant` (muted grey) to ensure the eye hits the most important data points first.

---

## 4. Elevation & Depth

We eschew traditional "box shadows" in favor of **Tonal Layering**.

*   **The Layering Principle:** Depth is achieved by "stacking." A `surface-container-lowest` card placed on a `surface-container-low` section creates a natural "inward" lift.
*   **Ambient Shadows:** For elements that must "float" (like dropdowns or tooltips), use a shadow with a 40px blur and only 6% opacity. The shadow color should be a deep purple tint (derived from `secondary`) rather than black, simulating the glow of the stadium lights.
*   **The "Ghost Border" Fallback:** If accessibility requires a container edge, use a "Ghost Border": the `outline-variant` token at 15% opacity. It should feel like a suggestion of an edge, not a hard line.
*   **Glassmorphism:** Use `surface-container-high` at 70% opacity with a `blur-xl` effect to create "frosted" overlays that allow the background gradients to bleed through.

---

## 5. Components

### Buttons
*   **Primary:** High-gloss gradient (`primary` to `primary-container`), bold `label-md` text in `on-primary-fixed`.
*   **Secondary:** Ghost-style. No fill, `Ghost Border` (15% opacity), with `on-surface` text.
*   **Interaction:** On hover, the primary button should "glow"—add a soft `primary` outer glow with a 15px spread at 20% opacity.

### Player Attribute Progress Bars
*   **Track:** `surface-container-highest`.
*   **Indicator:** `primary` for stats >80, `secondary` for 60-79, and `error` for <60.
*   **Detail:** Add a subtle 1px "shimmer" gradient moving across the bar to indicate active growth.

### Cards & Lists
*   **The Rule:** No dividers. Use `Spacing: 4` (0.9rem) between list items to create separation.
*   **Active State:** Use a `surface-bright` background with a subtle 2px left-accent strip of `primary` color.

### Player Avatars (Editorial Style)
*   Avatars should never be simple circles. Use the **Roundedness Scale** `xl` (0.75rem) for a "squircle" look.
*   Behind the player headshot, apply a subtle radial gradient of `secondary-container` at 30% opacity to "lift" the player from the dark background.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use `Spacing: 10` and `12` to create massive breathing room between major sections.
*   **Do** use intentional overlaps. Allow a player's shoulder or a trophy icon to "break out" of its container.
*   **Do** use `primary` (Green) sparingly. If everything is green, nothing is important.

### Don't:
*   **Don't** use pure black (#000000) for large surfaces; it feels "dead." Always use `surface` (#0e0e0e).
*   **Don't** use high-contrast white dividers. They create "visual noise" that distracts from the data.
*   **Don't** use "Default" transitions. All hovers should be 300ms with a `cubic-bezier(0.4, 0, 0.2, 1)` curve for a premium, heavy-weight feel.