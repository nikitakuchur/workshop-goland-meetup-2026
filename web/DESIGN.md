# Spotted! — design

Light and vivid: a pale lavender page with a faint dot grid, white cards, and a violet → pink →
orange gradient for everything that should pop. Loud motion, explosions included, but all of it
switches off under `prefers-reduced-motion`.

## Palette (`web/assets/css/app.css`, `:root`)

| Token | Value | Use |
|-------|-------|-----|
| `--bg` | `#f7f6fc` | Page background, `theme-color` |
| `--surface` | `#ffffff` | Cards, stat tiles, marquee pills |
| `--ink` / `--ink-soft` | `#16112b` / `#4b4766` | Text / secondary text (≥ 7:1 on white) |
| `--line` | `#e7e4f3` | Borders |
| `--violet` `--pink` `--orange` | `#7c3aed` `#ec4899` `#f97316` | `--grad`: decoration only (borders, bars, marquee band) |
| `--cyan` `--yellow` | `#06b6d4` `#facc15` | Particle colours only |
| `--violet-deep` `--pink-deep` `--orange-deep` | `#6d28d9` `#be185d` `#c2410c` | Text gradients (`--grad-text`), buttons (`--grad-button`), links, map markers |

Text never sits on the light gradient: white text only goes on `--grad-button` (deep stops).

## Type

- Display: **Outfit** 700–900 (`--font-display`), tight letter-spacing.
- Body: **Rubik** 400–600 (`--font-body`).
- Loaded from Google Fonts in the layout.

## Shape and space

- Spacing scale `--space-1` … `--space-16` (0.25rem steps).
- Radii: `--radius` 22px (cards), `--radius-sm` 12px (stat tiles), `--radius-pill` (buttons, tags, nav).
- Shadows: `--shadow` resting, `--shadow-lift` (violet-tinted) on hover and the map panel.

## Components

- **Header**: sticky, frosted (`backdrop-filter`), paw logo + gradient "Spotted!" wordmark, pill nav to `/#map` and `/#sightings`.
- **Hero**: two floating gradient blobs (violet, pink), eyebrow pill, giant shimmering gradient title that "booms" in, lead, stat tiles that count up, two buttons (filled gradient, ghost with gradient border).
- **Marquee**: a tilted gradient band scrolling the top 12 species as white pills; pauses on hover.
- **Map**: Leaflet with clusters inside a gradient-framed panel; markers `--pink-deep`.
- **Cards**: white, photo first at 4:3 (`object-fit: cover`), sideways-swipe strip when a sighting has several media, "+N more" badge, class tag pill, title, italic scientific name, meta list, "View record →". On hover: lift, 3D tilt to the pointer, glare, gradient border.
- **Footer**: GBIF credit and a "click anywhere" hint.

## Motion (`web/assets/js/app.js`)

- Canvas explosions (confetti, streaks, dots, flash and shockwave ring) on every click, three on load around the hero title (with a hero shake), and small sparks as cards pop in.
- Cards and section headings pop in on scroll (`.pop` → `.is-in`).
- Reduced motion: no canvas, no animations, everything visible, marquee becomes a static wrap.

## Avoid

- Emoji as icons; text on the light gradient; inline styles built from GBIF data.
