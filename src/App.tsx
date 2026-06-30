import { useEffect, useMemo, useState } from 'react'
import { useProducts } from './useProducts'
import { EMPTY_FILTERS, type Filters, type Product, type SortKey } from './types'
import { Header } from './components/Header'
import { FilterSidebar, type Facet } from './components/FilterSidebar'
import { ProductCard } from './components/ProductCard'
import { ProductModal } from './components/ProductModal'
import { Pagination } from './components/Pagination'
import { DiscoveryView } from './components/DiscoveryView'
import { Icon } from './components/Icon'
import { relatedProducts } from './discovery'

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Top Rated' },
  { value: 'reviews-desc', label: 'Most Reviewed' },
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'name-asc', label: 'Name: A–Z' },
]

/** Count occurrences of a string key across products, returned as sorted facets. */
function buildFacets(
  products: Product[],
  pick: (p: Product) => string | string[],
  sortByCount = false,
): Facet[] {
  const counts = new Map<string, number>()
  for (const p of products) {
    const v = pick(p)
    const values = Array.isArray(v) ? v : [v]
    for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1)
  }
  const facets = [...counts.entries()].map(([value, count]) => ({ value, count }))
  facets.sort((a, b) =>
    sortByCount ? b.count - a.count : a.value.localeCompare(b.value),
  )
  return facets
}

export default function App() {
  const { products, loading, error } = useProducts()
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [sort, setSort] = useState<SortKey>('featured')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(24)
  const [active, setActive] = useState<Product | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  // When true, the user has chosen to browse the full results listing
  // (via a sort change or a rail's "View all") rather than the curated home.
  const [browseAll, setBrowseAll] = useState(false)

  // Facets / price bounds are derived once from the full dataset.
  const categories = useMemo(
    () => buildFacets(products, (p) => p.category),
    [products],
  )
  const brands = useMemo(() => buildFacets(products, (p) => p.brand), [products])
  const tags = useMemo(
    () => buildFacets(products, (p) => p.tags, true),
    [products],
  )
  const priceMax = useMemo(
    () => products.reduce((m, p) => Math.max(m, p.price), 0) || 2000,
    [products],
  )

  const patchFilters = (patch: Partial<Filters>) => {
    setFilters((f) => ({ ...f, ...patch }))
  }

  // Reset to first page whenever the result set changes.
  useEffect(() => {
    setPage(1)
  }, [filters, sort, pageSize])

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase()
    const terms = q ? q.split(/\s+/) : []
    return products.filter((p) => {
      if (terms.length) {
        const haystack = `${p.title} ${p.brand} ${p.category} ${p.tags.join(
          ' ',
        )} ${p.description}`.toLowerCase()
        if (!terms.every((t) => haystack.includes(t))) return false
      }
      if (filters.categories.length && !filters.categories.includes(p.category))
        return false
      if (filters.brands.length && !filters.brands.includes(p.brand)) return false
      if (filters.tags.length && !filters.tags.every((t) => p.tags.includes(t)))
        return false
      if (filters.minPrice !== '' && p.price < filters.minPrice) return false
      if (filters.maxPrice !== '' && p.price > filters.maxPrice) return false
      if (filters.minRating && p.rating < filters.minRating) return false
      if (filters.inStockOnly && !p.inStock) return false
      return true
    })
  }, [products, filters])

  const sorted = useMemo(() => {
    const arr = [...filtered]
    switch (sort) {
      case 'price-asc':
        arr.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        arr.sort((a, b) => b.price - a.price)
        break
      case 'rating-desc':
        arr.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
        break
      case 'reviews-desc':
        arr.sort((a, b) => b.reviews - a.reviews)
        break
      case 'newest':
        arr.sort(
          (a, b) =>
            new Date(b.releasedAt).getTime() - new Date(a.releasedAt).getTime(),
        )
        break
      case 'name-asc':
        arr.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'featured':
      default:
        // Curated: strong rating weighted by review volume.
        arr.sort(
          (a, b) =>
            b.rating * Math.log10(b.reviews + 1) -
            a.rating * Math.log10(a.reviews + 1),
        )
    }
    return arr
  }, [filtered, sort])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageItems = useMemo(
    () => sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [sorted, currentPage, pageSize],
  )

  const goToPage = (p: number) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Active-filter chips shown above the grid.
  const chips = useMemo(() => {
    const out: { key: string; label: string; clear: () => void }[] = []
    filters.categories.forEach((c) =>
      out.push({
        key: `c-${c}`,
        label: c,
        clear: () =>
          patchFilters({ categories: filters.categories.filter((x) => x !== c) }),
      }),
    )
    filters.brands.forEach((b) =>
      out.push({
        key: `b-${b}`,
        label: b,
        clear: () =>
          patchFilters({ brands: filters.brands.filter((x) => x !== b) }),
      }),
    )
    filters.tags.forEach((t) =>
      out.push({
        key: `t-${t}`,
        label: `#${t}`,
        clear: () => patchFilters({ tags: filters.tags.filter((x) => x !== t) }),
      }),
    )
    if (filters.minPrice !== '' || filters.maxPrice !== '') {
      out.push({
        key: 'price',
        label: `$${filters.minPrice || 0} – $${filters.maxPrice || '∞'}`,
        clear: () => patchFilters({ minPrice: '', maxPrice: '' }),
      })
    }
    if (filters.minRating) {
      out.push({
        key: 'rating',
        label: `${filters.minRating}★ & up`,
        clear: () => patchFilters({ minRating: 0 }),
      })
    }
    if (filters.inStockOnly) {
      out.push({
        key: 'stock',
        label: 'In stock',
        clear: () => patchFilters({ inStockOnly: false }),
      })
    }
    return out
  }, [filters])

  const activeCount =
    filters.categories.length +
    filters.brands.length +
    filters.tags.length +
    (filters.minPrice !== '' || filters.maxPrice !== '' ? 1 : 0) +
    (filters.minRating ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0)

  // Returning to the curated home means dropping every filter *and* the
  // explicit "browse all" intent.
  const resetToDiscovery = () => {
    setFilters(EMPTY_FILTERS)
    setBrowseAll(false)
  }
  const clearAll = resetToDiscovery

  const hasQuery = filters.search.trim().length > 0
  // Discovery (curated) home shows until the user searches, filters, or
  // explicitly asks to browse the full listing.
  const inResults = hasQuery || activeCount > 0 || browseAll

  const selectCategory = (category: string) =>
    patchFilters({ categories: [category] })
  const viewAll = (nextSort: SortKey) => {
    setSort(nextSort)
    setBrowseAll(true)
  }

  const related = useMemo(
    () => (active ? relatedProducts(active, products) : []),
    [active, products],
  )

  return (
    <div className="app">
      <Header onOpenFilters={() => setSidebarOpen(true)} />
      <div className="shell">
        <FilterSidebar
          open={sidebarOpen}
          filters={filters}
          categories={categories}
          brands={brands}
          tags={tags}
          priceMax={priceMax}
          activeCount={activeCount}
          onChange={patchFilters}
          onClear={clearAll}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="content">
          <div className="toolbar">
            {inResults && (
              <button className="back-link" onClick={resetToDiscovery}>
                <Icon name="chevron_left" />
                Back to Discovery
              </button>
            )}
            <div className="toolbar__title">
              <h1>{inResults ? 'Browse the Collection' : 'Discover Orla & Vine'}</h1>
              <p>
                {inResults
                  ? 'Refine with search, filters and sorting.'
                  : 'Curated objects for considered living.'}
              </p>
            </div>

            <div className="toolbar__row">
              <div className="searchbar">
                <Icon name="search" className="lead" />
                <input
                  type="search"
                  placeholder="Search products, brands, materials…"
                  value={filters.search}
                  onChange={(e) => patchFilters({ search: e.target.value })}
                />
                {filters.search && (
                  <button
                    className="clear"
                    aria-label="Clear search"
                    onClick={() => patchFilters({ search: '' })}
                  >
                    <Icon name="close" />
                  </button>
                )}
              </div>

              {inResults && (
                <div className="sort">
                  <label htmlFor="sort">Sort</label>
                  <select
                    id="sort"
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortKey)}
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <Icon name="expand_more" className="caret" />
                </div>
              )}
            </div>

            {inResults && (
              <div className="meta-row">
                <span className="result-count">
                  <strong>{sorted.length.toLocaleString()}</strong>{' '}
                  {sorted.length === 1 ? 'piece' : 'pieces'}
                </span>
                {chips.length > 0 && (
                  <div className="active-filters">
                    {chips.map((chip) => (
                      <span className="pill" key={chip.key}>
                        {chip.label}
                        <button
                          onClick={chip.clear}
                          aria-label={`Remove ${chip.label}`}
                        >
                          <Icon name="close" />
                        </button>
                      </span>
                    ))}
                    <button className="clear-all" onClick={clearAll}>
                      Clear all
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {error ? (
            <div className="state">
              <Icon name="error" />
              <h3>Something went wrong</h3>
              <p>{error}</p>
            </div>
          ) : loading ? (
            <div className="grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div className="card" key={i}>
                  <div className="skeleton media" />
                  <div className="skeleton line" style={{ width: '40%' }} />
                  <div className="skeleton line" style={{ width: '80%' }} />
                  <div className="skeleton line" style={{ width: '50%' }} />
                </div>
              ))}
            </div>
          ) : !inResults ? (
            <DiscoveryView
              products={products}
              onOpen={setActive}
              onSelectCategory={selectCategory}
              onViewAll={viewAll}
            />
          ) : pageItems.length === 0 ? (
            <div className="state">
              <Icon name="search_off" />
              <h3>No pieces found</h3>
              <p>Try adjusting your filters or search terms.</p>
              <button className="btn" onClick={clearAll}>
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid">
                {pageItems.map((p) => (
                  <ProductCard key={p.id} product={p} onOpen={setActive} />
                ))}
              </div>
              <Pagination
                page={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                onPage={goToPage}
                onPageSize={setPageSize}
              />
            </>
          )}
        </main>
      </div>

      <ProductModal
        product={active}
        related={related}
        onClose={() => setActive(null)}
        onSelect={setActive}
      />
    </div>
  )
}
