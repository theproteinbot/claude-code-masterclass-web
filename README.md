# Claude Code Masterclass Interactive Site

Interactive class website built from the canonical markdown curriculum artifacts in `../out_full/`.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Framer Motion
- `next-themes` (dark mode)
- `react-markdown` + `remark-gfm`

## Source Content (Canonical)

This project reads markdown directly from:

- `../out_full/MASTERCLASS_OVERVIEW.md`
- `../out_full/LEARNING_PATHS.md`
- `../out_full/WORKSHOP_90MIN.md`
- `../out_full/LABS.md`
- `../out_full/RUBRICS.md`
- `../out_full/CAPSTONE.md`
- `../out_full/PROMPT_CARDS.md`
- `../out_full/FACILITATOR_GUIDE.md`
- `../out_full/REFERENCE_PACK.md`
- `../out_full/SLIDE_OUTLINE.md`

## Commands

### Install

```bash
cd site
npm install
```

### Dev

```bash
cd site
npm run dev
```

### Build

```bash
cd site
npm run build
```

### Preview

```bash
cd site
npm run preview
```

Then open `http://localhost:3000`.

## Features

- Home page with class overview + CTA
- Learning paths (beginner/intermediate/advanced)
- Interactive 90-minute workshop timeline
- Labs with expandable checkpoints and local progress state
- Rubrics and capstone scoring/supporting criteria
- Prompt cards with copy-to-clipboard buttons
- Facilitator guide view
- References page with trusted-source links preserved
- Search/filter across modules and activities
- LocalStorage-backed progress tracker and visited pages
- Dark mode toggle and subtle motion transitions

## Notes

- Progress is stored in the browser (`localStorage`) under `masterclass-progress-v1`.
- The app assumes `site/` sits beside `out_full/` in the same workspace.
