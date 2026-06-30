# Orla &amp; Vine — Product Discovery

A single-page product discovery interface built with **Vite + React + TypeScript**. It lets shoppers search, filter, sort, and page through a catalogue of 4,000 products, with a quick-look detail modal for each item.

The UI follows the **"Organic Quiet Luxury"** design system — an editorial, gallery-style aesthetic pairing *Bodoni Moda* headlines with *Hanken Grotesk* body text over a warm sand/linen/clay palette.

![Discovery collection](../stitch_responsive_product_discovery_interface/populated_product_discovery_orla_vine/screen.png)

## Features

### Search
- Full-text search across product **title, brand, category, tags, and description**
- Multi-term matching (every word must match), with a clear button

### Filters (collapsible sidebar)
- **Category** &amp; **Brand** — searchable checkbox lists showing a live result count per option
- **Tags** — searchable, multi-select pill cloud (AND logic)
- **Price range** — `min`/`max` number inputs kept in sync with a slider
- **Rating** — "X stars &amp; up" radio options
- **Availability** — in-stock-only toggle
- Selected filters appear as removable chips above the grid; **Clear all** resets everything
- On mobile the sidebar becomes a slide-over drawer (hamburger button in the header)

### Sorting
Featured (rating weighted by review volume), Price ↑ / ↓, Top Rated, Most Reviewed, Newest Arrivals, and Name A–Z.

### Pagination
Compact numbered pager (`1 … 5 [6] 7 … 167`) with previous/next controls, a selectable page size (12 / 24 / 48 / 96), and scroll-to-top on page change.

### Product cards &amp; detail modal
- 3:4 "gallery" cards with brand, title, price, star rating, a **Best Seller** ribbon (high rating + high review count), and a **Sold Out** overlay
- Clicking a card opens a detail modal (image, story, specs, tags, add-to-bag / wishlist) — dismissible via the ✕, the backdrop, or the `Esc` key

## Tech stack

| Concern    | Choice                                               |
| ---------- | ---------------------------------------------------- |
| Build tool | Vite                                                 |
| UI         | React 19 + TypeScript                                |
| Styling    | Hand-authored CSS with design tokens (CSS variables) |
| Icons      | Material Symbols (via Google Fonts)                  |
| Fonts      | Bodoni Moda + Hanken Grotesk (via Google Fonts)      |
| Data       | Static `public/products.json`, loaded with `fetch`   |

No CSS framework or component library is used — the design system lives in `src/index.css`.

## Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
```

Other scripts:

```bash
npm run build    # type-check (tsc -b) and produce a production build in dist/
npm run preview  # serve the production build locally
npm run lint     # run ESLint
```

> **Note:** product images are served from `picsum.photos`, so an internet connection is needed for thumbnails to load. Layout and aspect ratios hold regardless.

## Project structure

```
p-page/
├── public/
│   └── products.json          # the 4,000-item product dataset (static asset)
├── src/
│   ├── App.tsx                # state, filtering, sorting & pagination logic
│   ├── useProducts.ts         # fetch + normalise the dataset
│   ├── types.ts               # Product, Filters, SortKey types
│   ├── format.ts              # price & date formatting helpers
│   ├── index.css              # design system (tokens) + all component styles
│   └── components/
│       ├── Header.tsx         # top navigation bar
│       ├── FilterSidebar.tsx  # all filter facets
│       ├── Collapsible.tsx    # animated expand/collapse section
│       ├── ProductCard.tsx    # grid card
│       ├── ProductModal.tsx   # quick-look detail dialog
│       ├── Pagination.tsx     # numbered pager + page-size select
│       ├── StarRating.tsx     # 5-star display (half-star precision)
│       └── Icon.tsx           # Material Symbols wrapper
└── index.html
```

## How it works

State lives in `App.tsx` and the derived views are memoised in a clear pipeline:

```
products ──filter──▶ filtered ──sort──▶ sorted ──slice──▶ current page
```

- **Facets** (category / brand / tag options and their counts) are computed once from the full dataset, so each filter shows how many products match.
- **Filtering** narrows on search terms, selected categories/brands/tags, price bounds, minimum rating, and stock status.
- **Sorting** reorders the filtered set; *Featured* ranks by `rating × log10(reviews + 1)` to surface well-reviewed favourites.
- **Pagination** slices the sorted set; changing any filter or the sort resets to page 1.

### Data normalisation

The dataset is intentionally messy: some `price` values arrive as strings or `null`, and a few other fields can be missing. `useProducts.ts` coerces every record into a clean, fully-typed `Product` before it reaches the UI, so the rest of the app can rely on consistent types.
