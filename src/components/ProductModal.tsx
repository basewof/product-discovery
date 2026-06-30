import { useEffect } from 'react'
import type { Product } from '../types'
import { Icon } from './Icon'
import { StarRating } from './StarRating'
import { formatPrice, formatDate } from '../format'

interface ProductModalProps {
  product: Product | null
  onClose: () => void
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  useEffect(() => {
    if (!product) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [product, onClose])

  if (!product) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={product.title}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal__close" onClick={onClose} aria-label="Close">
          <Icon name="close" />
        </button>
        <div className="modal__media">
          <img src={product.image} alt={product.title} />
        </div>
        <div className="modal__body">
          <span className="modal__brand">{product.brand}</span>
          <h2 className="modal__title">{product.title}</h2>
          <div className="modal__price">{formatPrice(product.price)}</div>
          <div className="modal__rating">
            <StarRating value={product.rating} />
            <span>
              {product.rating.toFixed(1)} · {product.reviews.toLocaleString()}{' '}
              reviews
            </span>
          </div>

          <p
            className={`in-stock-line ${product.inStock ? 'yes' : 'no'}`}
          >
            <Icon name={product.inStock ? 'check_circle' : 'cancel'} fill />
            {product.inStock ? 'In stock — ready to ship' : 'Currently sold out'}
          </p>

          <div className="modal__section-label">The Story</div>
          <p className="modal__desc">{product.description}</p>

          {product.tags.length > 0 && (
            <div className="modal__tags">
              {product.tags.map((t) => (
                <span key={t} className="tag-chip">
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="modal__specs">
            <div className="modal__spec">
              <span>Category</span>
              <span>{product.category}</span>
            </div>
            <div className="modal__spec">
              <span>Released</span>
              <span>{formatDate(product.releasedAt)}</span>
            </div>
            <div className="modal__spec">
              <span>Product ID</span>
              <span>#{product.id}</span>
            </div>
          </div>

          <div className="modal__actions">
            <button className="btn" disabled={!product.inStock}>
              <Icon name="shopping_bag" />
              {product.inStock ? 'Add to Bag' : 'Sold Out'}
            </button>
            <button className="btn btn--ghost">
              <Icon name="favorite" />
              Save to Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
