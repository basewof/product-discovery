import { useEffect, useState } from 'react'
import type { Product } from './types'

interface State {
  products: Product[]
  loading: boolean
  error: string | null
}

/** Normalise a raw record from products.json (some prices arrive as strings / null). */
function normalise(raw: unknown): Product | null {
  const r = raw as Record<string, unknown>
  if (r == null || typeof r.id !== 'number') return null
  const price = Number(r.price)
  return {
    id: r.id,
    title: String(r.title ?? 'Untitled'),
    brand: String(r.brand ?? 'Unknown'),
    category: String(r.category ?? 'Uncategorised'),
    tags: Array.isArray(r.tags) ? (r.tags as string[]) : [],
    price: Number.isFinite(price) ? price : 0,
    rating: Number(r.rating) || 0,
    reviews: Number(r.reviews) || 0,
    inStock: Boolean(r.inStock),
    releasedAt: String(r.releasedAt ?? ''),
    image: String(r.image ?? ''),
    imageWidth: Number(r.imageWidth) || 500,
    imageHeight: Number(r.imageHeight) || 500,
    description: String(r.description ?? ''),
  }
}

export function useProducts(): State {
  const [state, setState] = useState<State>({
    products: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    let cancelled = false
    fetch(`${import.meta.env.BASE_URL}products.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load products (${res.status})`)
        return res.json()
      })
      .then((data: unknown[]) => {
        if (cancelled) return
        const products = data
          .map(normalise)
          .filter((p): p is Product => p !== null)
        setState({ products, loading: false, error: null })
      })
      .catch((err: Error) => {
        if (cancelled) return
        setState({ products: [], loading: false, error: err.message })
      })
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
