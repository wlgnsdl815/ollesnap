# Ollesnap Design Guide

## Purpose and source of truth

Ollesnap helps couples compare 제주 wedding-snap photographers and compatible styling services, then form a shooting team. It is a 2026 관광데이터 활용 공모전 submission designed mobile-first for a 390px viewport.

- Visual tokens and component behavior are adapted from the LikeLion Design System.
- Brand narrative, product rules, voice, and UX principles are Ollesnap's own.
- `src/app/globals.css` is the executable source of truth for colors and Tailwind token names. Use semantic utilities in components instead of raw hex values.
- Light mode is the supported product theme. The existing `.dark` variables are library compatibility only; do not introduce dark-mode UI or a theme switch unless requested.

## Product boundaries

- Ask for the desired 제주 scene and photo tone before suggesting a photographer.
- Do not expose private photo spots or let users select an exact shooting location. The photographer makes the final location decision according to weather and light.
- Use public tourism data for post-shoot stay and travel ideas, not as a shooting-location replacement.

## Visual system

| Role | Semantic token | Use |
|---|---|---|
| Primary orange | `primary` | One primary action per context: save, add, next |
| Primary tint/faint | `primary-tint`, `primary-faint` | Gentle emphasis and selected-outline chip |
| Foreground/label | `foreground`, `label` | Main and secondary text |
| Dark emphasis | `ink-strong` | Active segmented-tab fill, neutral button fill |
| Muted/faint | `muted-foreground`, `faint` | Metadata and low-emphasis text |
| Surface | `secondary`, `surface`, `surface-faint` | Section separation and skeletons |
| Border/hairline | `border`, `hairline` | Inputs, cards, and dividers |
| Cream | `cream`, `accent` | Warm promo and recommendation surfaces |
| Semantic feedback | `success`, `destructive`, `yellow` | Success, error, and ratings only |

- Use Pretendard Variable throughout. Headings use weight 600; body and UI labels use weight 400.
- Maintain a 4px-based rhythm: `2/4/8/12/16/20/24/32/48`.
- Use no drop shadows. Establish depth with surfaces and 1px hairlines.
- Radius: button 6px, input 8px, standard card 12px, promo card 16px, chips/tabs pill.

| Role | Size / weight / line-height | Use |
|---|---|---|
| Display | 52px / 600 / 1.3 | Landing or onboarding headline |
| H1 | 31px / 600 / 1.3 | Page title |
| Subtitle | 17px / 600 / 1.3 | Section title |
| Body | 16px / 400 / 1.5 | Reading text and navigation |
| Body small | 15px / 400 / 1.6 | Chips, tabs, tags |
| Button | 16px / 600 / 1 | Button label |
| Caption | 13px / 400 / 1.5 | Metadata |

## Blend-in rules (avoid the generic AI look)

New UI must look like it was always part of the app. Before inventing a layout, find the closest existing screen and reuse its structure and spacing.

- No gradients, gradient text, glassmorphism, or drop shadows. Depth comes from surfaces and hairlines only.
- No colors, typefaces, or radius values beyond the tokens above.
- No decorative numbered markers (01/02/03), no emoji as icons (use `lucide-react`), no oversized hero stat blocks — unless the content genuinely is a sequence or a metric.
- One emphasis per screen: a single `primary` action and at most one `cream` highlight surface. Everything else stays quiet.

## Component rules

| Component | Specification |
|---|---|
| Primary button | `bg-primary`, white label, 48px height, 6px radius. Pressed/hover uses `primary-hover`; disabled uses `secondary` and disabled text. |
| Neutral / assistive button | Neutral is `ink-strong` filled with white text; assistive is `secondary` with `label` text. Keep the same 48px height. |
| Text field | White surface, `border`, 48px height, 8px radius; focus with `label` border. |
| Plain card | White surface, `hairline` border, 12px radius, no shadow. |
| Warm promo card | `cream` surface, 16px radius. Use 40px padding only for a full promo block; use the spacing scale for regular cards. |
| Filter chip | Default: white, `border`, `label` text. Selected: `primary` fill and white text. Visual height is 30px; its tap target must still be at least 44px. |
| Selected-outline chip | `primary-faint` surface, `primary` border and text. Use only as a documented alternative selection style; do not mix it with filled selected chips in one control. |
| Segmented tab | 40px visual height, pill radius. Inactive: white with `border` and `label`; active: `ink-strong` fill with white text. |

## Responsive and accessibility behavior

- Mobile (360–639px): one column; use vertical lists or intentional horizontal carousels.
- Tablet (640–1023px): use a two-column card grid where content benefits from it.
- Desktop (1024px+): expand containers and columns; do not merely stretch the mobile column.
- Keep text at 15px or larger for normal mobile UI. Use `focus-visible`, active/pressed states, and accessible labels for icon-only controls.
- Use `next/image` when suitable and provide meaningful alternative text. Respect `prefers-reduced-motion`; motion must never be required to understand or operate a control.

## Content, feedback, and motion

The voice is a friendly, practical shooting-preparation companion: concise, concrete, and centered on scene, tone, and team composition. Avoid exaggerated marketing language, emoji overuse, and unsupported recommendations.

| State | Treatment |
|---|---|
| Empty | Brief guidance and a primary action to reset or adjust scene/tone filters. |
| Loading | `surface`/`surface-faint` skeletons matching the final card radius. |
| Error | Plain explanation with a retry action; focus on the next action rather than technical cause. |
| Success | Brief inline confirmation, optionally `success`, plus the next action. |
| Disabled | `secondary` surface and disabled text. |

- Fast interaction: 120ms; standard feedback: 200ms; slow page-level transition: 320ms.
- Use `cubic-bezier(0.2, 0.6, 0.25, 1)` for entry motion. Honor reduced-motion preferences.
