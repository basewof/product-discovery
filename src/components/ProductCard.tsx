import type { Product } from '../types'
import { Icon } from './Icon'
import { formatPrice } from '../format'

interface ProductCardProps {
  product: Product
  onOpen: (product: Product) => void
}

/** Products with many reviews and a high rating get the "Best Seller" ribbon. */
function isBestSeller(p: Product) {
  return p.rating >= 4.5 && p.reviews >= 1000
}

export function ProductCard({ product, onOpen }: ProductCardProps) {
  return (
    <button className="card" onClick={() => onOpen(product)}>
      <div className="card__media">
        <img src={product.image} alt={product.title} loading="lazy" />
        {isBestSeller(product) && <span className="card__badge">Best Seller</span>}
        {!product.inStock && (
          <div className="card__oos">
            <span>Sold Out</span>
          </div>
        )}
      </div>
      <div>
        <div className="card__brand">{product.brand}</div>
        <h3 className="card__title">{product.title}</h3>
        <div className="card__foot">
          <span className="card__price">{formatPrice(product.price)}</span>
          <span className="rating">
            <Icon name="star" fill />
            <span className="val">
              {product.rating.toFixed(1)} ({product.reviews})
            </span>
          </span>
        </div>
      </div>
    </button>
  )
}
