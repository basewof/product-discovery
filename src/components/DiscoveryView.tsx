import { useMemo } from 'react'
import type { Product, SortKey } from '../types'
import {
  categoryTiles,
  heroProduct,
  newArrivals,
  topRated,
  trending,
} from '../discovery'
import { formatPrice } from '../format'
import { ProductRail } from './ProductRail'
import { StarRating } from './StarRating'
import { Icon } from './Icon'

interface DiscoveryViewProps {
  products: Product[]
  onOpen: (product: Product) => void
  onSelectCategory: (category: string) => void
  onViewAll: (sort: SortKey) => void
}

export function DiscoveryView({
  products,
  onOpen,
  onSelectCategory,
  onViewAll,
}: DiscoveryViewProps) {
  const hero = useMemo(() => heroProduct(products), [products])
  const tiles = useMemo(() => categoryTiles(products), [products])
  const trendingItems = useMemo(() => trending(products), [products])
  const newItems = useMemo(() => newArrivals(products), [products])
  const topItems = useMemo(() => topRated(products), [products])

  return (
    <div className="discovery">
      {hero && (
        <section
          className="hero"
          onClick={() => onOpen(hero)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onOpen(hero)}
        >
          <div className="hero__media">
            <img src={hero.image} alt={hero.title} />
          </div>
          <div className="hero__body">
            <span className="hero__eyebrow">Editor's Pick · {hero.brand}</span>
            <h2 className="hero__title">{hero.title}</h2>
            <p className="hero__desc">{hero.description}</p>
            <div className="hero__meta">
              <StarRating value={hero.rating} />
              <span className="hero__reviews">
                {hero.rating.toFixed(1)} · {hero.reviews.toLocaleString()} reviews
              </span>
            </div>
            <div className="hero__foot">
              <span className="hero__price">{formatPrice(hero.price)}</span>
              <span className="btn">
                Discover <Icon name="arrow_forward" />
              </span>
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="section__head">
          <div>
            <h2 className="section__title">Shop by Category</h2>
            <p className="section__caption">
              Explore the collection by the spaces you love.
            </p>
          </div>
        </div>
        <div className="collection-tiles">
          {tiles.map((tile) => (
            <button
              key={tile.category}
              className="collection-tile"
              onClick={() => onSelectCategory(tile.category)}
            >
              <img src={tile.image} alt={tile.category} loading="lazy" />
              <span className="collection-tile__overlay" />
              <span className="collection-tile__label">
                <span className="collection-tile__name">{tile.category}</span>
                <span className="collection-tile__count">
                  {tile.count} pieces
                </span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <ProductRail
        title="Trending Now"
        caption="The pieces everyone is reaching for."
        products={trendingItems}
        onOpen={onOpen}
        onViewAll={() => onViewAll('reviews-desc')}
      />

      <ProductRail
        title="New Arrivals"
        caption="Freshly added to the collection."
        products={newItems}
        onOpen={onOpen}
        onViewAll={() => onViewAll('newest')}
      />

      <ProductRail
        title="Most Loved"
        caption="Top-rated by our community."
        products={topItems}
        onOpen={onOpen}
        onViewAll={() => onViewAll('rating-desc')}
      />
    </div>
  )
}
