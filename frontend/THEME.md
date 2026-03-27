# Website Theme Guide

This site uses a **light theme only**. Dark mode has been removed.

---

## Changing colors and styling

- **Components:** Edit the component files in `src/components/` and `src/pages/`. Styles use Tailwind CSS classes (e.g. `bg-white`, `text-gray-800`, `border-gray-200`). Change these to adjust colors.
- **Global styles:** Edit `src/index.css` for site-wide styles (e.g. body, `.hero-gradient`).
- **Tailwind config:** Edit `tailwind.config.js` to extend or override the default theme (e.g. add custom colors, spacing).

---

## Hero gradient (blue water theme)

The animated blue gradient on the hero is in **`src/index.css`**:

- Look for: `/* Animated Gradient Background - Blue Water Theme */`
- The class is `.hero-gradient`. Change the `linear-gradient(...)` values to use different colors.

---

## Quick reference

| Goal | File to edit |
|------|----------------|
| Page/component colors | That component’s JSX (Tailwind classes) |
| Global styles or hero gradient | `src/index.css` |
| Custom theme tokens (colors, spacing) | `tailwind.config.js` → `theme.extend` |
