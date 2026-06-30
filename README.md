### Project Approach and Process

To ensure I was working with the most current and accurate information, I began by researching the concept of a **product discovery page**. This is a standard step I take on every project, even when I am already familiar with the topic, as best practices and implementations can evolve over time.

Initially I was going to build a product search page, but through this research, I confirmed that while a product discovery page shares similarities with a product search page, the two serve distinct purposes. A discovery page focuses on helping users explore and find relevant products through curated browsing, recommendations, and intuitive navigation, rather than direct keyword-based searching.

#### Design Research and Inspiration
I gathered design inspiration from platforms such as Dribbble, Pinterest, and drip.com. My initial searches for “product discovery page” yielded limited useful results. Thanks to the earlier research, I refined my query to “product search page,” which provided more relevant and high-quality design examples. From these, I selected the design that most closely aligned with a product discovery experience and adapted it with necessary modifications to better fit the project requirements.

#### Data Analysis
Next, I thoroughly analyzed the JSON product dataset. The review revealed that all products follow a consistent, standardized structure. This uniformity eliminated the need for special handling or custom scenarios for individual products. Additionally, the image heights across most products were reasonably similar, removing the requirement for complex layout adjustments to accommodate disproportionate dimensions.

This analysis allowed me to define a clear, reusable prototype for product display and develop a generic, scalable approach for rendering any product in the collection.

I also identified certain product attributes (such as tags) that have high cardinality. Displaying all options for these attributes directly on the page would make it excessively long and overwhelming. I documented these attributes for special implementation, such as collapsible sections, dropdowns, or advanced filtering controls.

#### UI Design and Development
I designed the user interface using Google Stitch, following the detailed specifications and requirements defined earlier.

For frontend development, I leveraged Claude to generate the code. I provided it with the complete product dataset, the UI design, technical specifications, and clear guidelines regarding constraints and areas of flexibility.

#### Next Steps
With the product discovery page now deployed, the following key steps are planned:
- Perform comprehensive testing, including cross-browser compatibility, mobile responsiveness, accessibility, and performance audits using tools like Google Lighthouse.
- Collect user feedback through testing sessions or surveys to identify usability improvements.
- Implement analytics (e.g., Google Analytics 4) to monitor user behavior, popular filters, search patterns, and engagement metrics.
- Transition from static JSON data to a dynamic backend API for better scalability and real-time updates.
- Optimize SEO, set up error monitoring, and enhance overall performance.
- Iterate on the page based on data and feedback to further refine the user experience.



# Orla &amp; Vine — Product Discovery

A single-page product discovery interface built with **Vite + React + TypeScript**. It lets shoppers search, filter, sort, and page through a catalogue of 4,000 products, with a quick-look detail modal for each item.

The UI follows the **"Organic Quiet Luxury"** design system — an editorial, gallery-style aesthetic pairing *Bodoni Moda* headlines with *Hanken Grotesk* body text over a warm sand/linen/clay palette.

**Live demo:** [product-discovery-bay.vercel.app](https://product-discovery-bay.vercel.app/)

The page has two modes. By default it opens on a **curated discovery home** where the system proposes content. The moment the shopper searches, applies a filter, or chooses to browse a rail in full, it switches to a **results view** (the searchable, filterable, paginated grid). "Back to Discovery" returns to the curated home.

## Features

### Discovery home (default)
A system-curated landing experience shown when no search or filter is active:
- **Editor's Pick hero** — spotlights the highest-ranked product
- **Shop by Category** — image tiles per category (with piece counts) that jump straight into a filtered view
- **Curated rails** — horizontally scrollable carousels for **Trending Now** (best sellers), **New Arrivals** (newest releases), and **Most Loved** (top rated). Each rail's **View all** opens the full results listing with the matching sort applied.

### Search
- Full-text search across product **title, brand, category, tags, and description**
- Multi-term matching (every word must match), with a clear button

### Filters (collapsible sidebar)
- **Category** — checkbox list with a live result count per option
- **Brand** — searchable checkbox list with a live result count per option
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
- **"You May Also Like"** — content-based recommendations inside the modal, scored by shared tags, then category, then brand; clicking one swaps the modal to that product

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
│   ├── App.tsx                # state, discovery/results mode, filtering, sorting & pagination
│   ├── useProducts.ts         # fetch + normalise the dataset
│   ├── discovery.ts           # curation logic: hero, rails, category tiles, recommendations
│   ├── types.ts               # Product, Filters, SortKey types
│   ├── format.ts              # price & date formatting helpers
│   ├── index.css              # design system (tokens) + all component styles
│   └── components/
│       ├── Header.tsx         # top navigation bar
│       ├── FilterSidebar.tsx  # all filter facets
│       ├── Collapsible.tsx    # animated expand/collapse section
│       ├── DiscoveryView.tsx  # curated home: hero + category tiles + rails
│       ├── ProductRail.tsx    # horizontally scrollable product carousel
│       ├── ProductCard.tsx    # grid / rail card
│       ├── ProductModal.tsx   # quick-look detail dialog + recommendations
│       ├── Pagination.tsx     # numbered pager + page-size select
│       ├── StarRating.tsx     # 5-star display (half-star precision)
│       └── Icon.tsx           # Material Symbols wrapper
└── index.html
```

## How it works

### Discovery vs. results mode

`App.tsx` shows the curated **discovery home** until the shopper expresses intent — a search term, an active filter, or an explicit "browse all" (changing the sort or tapping a rail's _View all_). Any of those flips the page into **results mode**; **Back to Discovery** clears them and returns to the curated home.

The discovery rails and recommendations are pure functions in `discovery.ts` (hero pick, trending, new arrivals, top rated, category tiles, and content-based related products), so the curation rules live in one place and are easy to tune.

### Results pipeline

In results mode the derived views are memoised in a clear pipeline:

```
products ──filter──▶ filtered ──sort──▶ sorted ──slice──▶ current page
```

- **Facets** (category / brand / tag options and their counts) are computed once from the full dataset, so each filter shows how many products match.
- **Filtering** narrows on search terms, selected categories/brands/tags, price bounds, minimum rating, and stock status.
- **Sorting** reorders the filtered set; *Featured* ranks by `rating × log10(reviews + 1)` to surface well-reviewed favourites.
- **Pagination** slices the sorted set; changing any filter or the sort resets to page 1.

### Data normalisation

The dataset is intentionally messy: some `price` values arrive as strings or `null`, and a few other fields can be missing. `useProducts.ts` coerces every record into a clean, fully-typed `Product` before it reaches the UI, so the rest of the app can rely on consistent types.
