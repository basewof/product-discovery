import { useRef } from 'react'
import type { Product } from '../types'
import { ProductCard } from './ProductCard'
import { Icon } from './Icon'

interface ProductRailProps {
  title: string
  caption?: string
  products: Product[]
  onOpen: (product: Product) => void
  onViewAll?: () => void
}

export function ProductRail({
  title,
  caption,
  products,
  onOpen,
  onViewAll,
}: ProductRailProps) {
  const trackRef = useRef<HTMLDivElement>(null)

  if (products.length === 0) return null

  const scrollBy = (dir: number) => {
    trackRef.current?.scrollBy({ left: dir * 600, behavior: 'smooth' })
  }

  return (
    <section className="section">
      <div className="section__head">
        <div>
          <h2 className="section__title">{title}</h2>
          {caption && <p className="section__caption">{caption}</p>}
        </div>
        <div className="section__controls">
          {onViewAll && (
            <button className="link-btn" onClick={onViewAll}>
              View all
            </button>
          )}
          <button
            className="rail-nav"
            onClick={() => scrollBy(-1)}
            aria-label="Scroll left"
          >
            <Icon name="chevron_left" />
          </button>
          <button
            className="rail-nav"
            onClick={() => scrollBy(1)}
            aria-label="Scroll right"
          >
            <Icon name="chevron_right" />
          </button>
        </div>
      </div>
      <div className="rail" ref={trackRef}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onOpen={onOpen} />
        ))}
      </div>
    </section>
  )
}
