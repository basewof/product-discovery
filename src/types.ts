export interface Product {
  id: number
  title: string
  brand: string
  category: string
  tags: string[]
  price: number
  rating: number
  reviews: number
  inStock: boolean
  releasedAt: string
  image: string
  imageWidth: number
  imageHeight: number
  description: string
}

export type SortKey =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'reviews-desc'
  | 'newest'
  | 'name-asc'

export interface Filters {
  search: string
  categories: string[]
  brands: string[]
  tags: string[]
  minPrice: number | ''
  maxPrice: number | ''
  minRating: number
  inStockOnly: boolean
}

export const EMPTY_FILTERS: Filters = {
  search: '',
  categories: [],
  brands: [],
  tags: [],
  minPrice: '',
  maxPrice: '',
  minRating: 0,
  inStockOnly: false,
}
