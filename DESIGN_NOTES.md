# Design Notes

## Structure

- `app/`: Next.js App Router pages for each required class section.
- `lib/content.ts`: canonical markdown loader + parsers (sections, labs, prompt cards, workshop agenda, references, search index).
- `components/ui/`: small shadcn-style primitives (`Button`, `Card`, `Badge`, `Input`, etc.).
- `components/sections/`: feature components (markdown renderer, search UI, progress dashboard, prompt-card board, learning-path filters).
- `components/providers/`: theme provider and local progress provider.

## Content Model

- Markdown in `../out_full` is treated as the source of truth.
- Files are parsed into heading-based `sections` with extracted bullets, URLs, and plain-text summaries.
- Page-specific parsers derive structured interactive views from the canonical markdown (workshop agenda blocks, labs, rubrics, prompt cards, reference entries).
- Raw canonical markdown is still visible on key pages to preserve citations/references and ensure traceability.

## Design Direction

- Vercel-style clean layout: restrained surfaces, spacious cards, subtle gradients, sticky header, and compact typography hierarchy.
- Motion is intentionally minimal: page fade-up transitions and hover lift on cards.
- Dark mode uses `next-themes` with CSS variables for consistent theming across primitives.
- UI favors card-based sections and collapsible details for dense curriculum content.

## Interaction Decisions

- Search/filter is centralized in `/search` and indexes all parsed sections + reference entries.
- Progress tracking is local-only (no backend) and shared across pages via React context + `localStorage`.
- Checklists are attached to outcomes, workshop agenda bullets, labs, rubrics, prompt usage, and facilitator prep items.

## Tradeoffs

- Parsing is heuristic (heading/bullet based) instead of a full markdown AST pipeline to keep runtime and implementation light.
- Some pages mix structured views with a "canonical markdown" panel to preserve fidelity where source formatting varies.
