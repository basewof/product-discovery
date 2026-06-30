import { useState } from 'react'
import type { Filters } from '../types'
import { Collapsible } from './Collapsible'
import { Icon } from './Icon'

export interface Facet {
  value: string
  count: number
}

interface FilterSidebarProps {
  open: boolean
  filters: Filters
  categories: Facet[]
  brands: Facet[]
  tags: Facet[]
  priceMax: number
  activeCount: number
  onChange: (patch: Partial<Filters>) => void
  onClear: () => void
  onClose: () => void
}

const RATINGS = [4, 3, 0]

function CheckList({
  facets,
  selected,
  placeholder,
  scroll,
  onToggle,
}: {
  facets: Facet[]
  selected: string[]
  placeholder: string
  scroll?: boolean
  onToggle: (value: string) => void
}) {
  const [query, setQuery] = useState('')
  const filtered = facets.filter((f) =>
    f.value.toLowerCase().includes(query.trim().toLowerCase()),
  )
  return (
    <>
      <div className="facet-search">
        <Icon name="search" />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {filtered.length === 0 ? (
        <p className="facet-empty">No matches</p>
      ) : (
        <ul className={`check-list${scroll ? ' scroll' : ''}`}>
          {filtered.map((f) => (
            <li key={f.value}>
              <label className="check">
                <input
                  type="checkbox"
                  checked={selected.includes(f.value)}
                  onChange={() => onToggle(f.value)}
                />
                <span className="text">{f.value}</span>
                <span className="count">{f.count}</span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export function FilterSidebar({
  open,
  filters,
  categories,
  brands,
  tags,
  priceMax,
  activeCount,
  onChange,
  onClear,
  onClose,
}: FilterSidebarProps) {
  const toggle = (key: 'categories' | 'brands' | 'tags', value: string) => {
    const current = filters[key]
    onChange({
      [key]: current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
    })
  }

  const [tagQuery, setTagQuery] = useState('')
  const visibleTags = tags.filter((t) =>
    t.value.toLowerCase().includes(tagQuery.trim().toLowerCase()),
  )

  return (
    <>
      {open && <div className="scrim" onClick={onClose} />}
      <aside className={`sidebar${open ? ' open' : ''}`}>
        <div className="sidebar__head">
          <div>
            <h2>Filters</h2>
            <p>Refine your search</p>
          </div>
          {activeCount > 0 && (
            <button className="clear-all" onClick={onClear}>
              Clear ({activeCount})
            </button>
          )}
        </div>

        <Collapsible icon="category" title="Category">
          <CheckList
            facets={categories}
            selected={filters.categories}
            placeholder="Search categories…"
            onToggle={(v) => toggle('categories', v)}
          />
        </Collapsible>

        <Collapsible icon="label" title="Brand">
          <CheckList
            facets={brands}
            selected={filters.brands}
            placeholder="Search brands…"
            scroll
            onToggle={(v) => toggle('brands', v)}
          />
        </Collapsible>

        <Collapsible icon="sell" title="Tags">
          <div className="facet-search">
            <Icon name="search" />
            <input
              type="text"
              placeholder="Search tags…"
              value={tagQuery}
              onChange={(e) => setTagQuery(e.target.value)}
            />
          </div>
          {visibleTags.length === 0 ? (
            <p className="facet-empty">No matches</p>
          ) : (
            <div className="tag-cloud">
              {visibleTags.map((t) => (
                <button
                  key={t.value}
                  className={`tag-chip${
                    filters.tags.includes(t.value) ? ' active' : ''
                  }`}
                  onClick={() => toggle('tags', t.value)}
                >
                  {t.value}
                </button>
              ))}
            </div>
          )}
        </Collapsible>

        <Collapsible icon="payments" title="Price Range">
          <div className="price-fields">
            <div className="price-input">
              <span>$</span>
              <input
                type="number"
                min={0}
                placeholder="0"
                value={filters.minPrice}
                onChange={(e) =>
                  onChange({
                    minPrice: e.target.value === '' ? '' : Number(e.target.value),
                  })
                }
              />
            </div>
            <span className="dash">—</span>
            <div className="price-input">
              <span>$</span>
              <input
                type="number"
                min={0}
                placeholder={String(Math.ceil(priceMax))}
                value={filters.maxPrice}
                onChange={(e) =>
                  onChange({
                    maxPrice: e.target.value === '' ? '' : Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
          <input
            className="range"
            type="range"
            min={0}
            max={Math.ceil(priceMax)}
            step={10}
            value={filters.maxPrice === '' ? Math.ceil(priceMax) : filters.maxPrice}
            onChange={(e) => onChange({ maxPrice: Number(e.target.value) })}
          />
          <div className="range-labels">
            <span>${filters.minPrice === '' ? 0 : filters.minPrice}</span>
            <span>
              ${filters.maxPrice === '' ? `${Math.ceil(priceMax)}+` : filters.maxPrice}
            </span>
          </div>
        </Collapsible>

        <Collapsible icon="star" title="Rating">
          <ul className="check-list">
            {RATINGS.map((r) => (
              <li key={r}>
                <label className="check">
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.minRating === r}
                    onChange={() => onChange({ minRating: r })}
                  />
                  <span className="text">
                    {r === 0 ? 'Any rating' : `${r} stars & up`}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </Collapsible>

        <Collapsible icon="inventory_2" title="Availability">
          <label className="stock-toggle" style={{ marginTop: 16 }}>
            <span>In stock only</span>
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => onChange({ inStockOnly: e.target.checked })}
            />
            <span className="switch" />
          </label>
        </Collapsible>
      </aside>
    </>
  )
}
