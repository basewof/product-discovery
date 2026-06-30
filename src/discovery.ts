import type { Product } from './types'

/** Curated "featured" score: strong rating amplified by review volume. */
export function featuredScore(p: Product): number {
  return p.rating * Math.log10(p.reviews + 1)
}

/** A product is a best seller when it is both highly rated and widely reviewed. */
export function isBestSeller(p: Product): boolean {
  return p.rating >= 4.5 && p.reviews >= 1000
}

function byFeatured(a: Product, b: Product) {
  return featuredScore(b) - featuredScore(a)
}

/** The single hero product: the most "featured", in stock, with a story to tell. */
export function heroProduct(products: Product[]): Product | null {
  const pool = products.filter((p) => p.inStock && p.image)
  if (!pool.length) return null
  return [...pool].sort(byFeatured)[0]
}

/** Trending = best sellers, most reviewed first. */
export function trending(products: Product[], limit = 12): Product[] {
  return products
    .filter((p) => isBestSeller(p) && p.inStock)
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, limit)
}

/** Newest arrivals by release date (in stock only). */
export function newArrivals(products: Product[], limit = 12): Product[] {
  return [...products]
    .filter((p) => p.inStock)
    .sort(
      (a, b) =>
        new Date(b.releasedAt).getTime() - new Date(a.releasedAt).getTime(),
    )
    .slice(0, limit)
}

/** Highest rated, weighted by reviews so a lone 5.0 doesn't dominate. */
export function topRated(products: Product[], limit = 12): Product[] {
  return [...products]
    .filter((p) => p.inStock)
    .sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
    .slice(0, limit)
}

export interface CategoryTile {
  category: string
  count: number
  image: string
}

/** One shoppable tile per category, using its most "featured" product as the cover. */
export function categoryTiles(products: Product[]): CategoryTile[] {
  const groups = new Map<string, Product[]>()
  for (const p of products) {
    const list = groups.get(p.category) ?? []
    list.push(p)
    groups.set(p.category, list)
  }
  return [...groups.entries()]
    .map(([category, list]) => {
      const cover = [...list].sort(byFeatured).find((p) => p.image) ?? list[0]
      return { category, count: list.length, image: cover?.image ?? '' }
    })
    .sort((a, b) => b.count - a.count)
}

/**
 * Content-based recommendations for the detail modal.
 * Scores other products by shared tags, then same category, then same brand.
 */
export function relatedProducts(
  target: Product,
  products: Product[],
  limit = 4,
): Product[] {
  const targetTags = new Set(target.tags)
  return products
    .filter((p) => p.id !== target.id)
    .map((p) => {
      const sharedTags = p.tags.filter((t) => targetTags.has(t)).length
      const score =
        sharedTags * 3 +
        (p.category === target.category ? 2 : 0) +
        (p.brand === target.brand ? 1 : 0)
      return { p, score }
    })
    .filter((x) => x.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        featuredScore(b.p) - featuredScore(a.p),
    )
    .slice(0, limit)
    .map((x) => x.p)
}
