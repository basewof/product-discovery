import { Icon } from './Icon'

interface StarRatingProps {
  value: number
  size?: number
}

/** Five-star display with half-star precision. */
export function StarRating({ value, size = 16 }: StarRatingProps) {
  return (
    <span className="rating" aria-label={`${value} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const filled = value >= i + 1
        const half = !filled && value > i
        return (
          <Icon
            key={i}
            name={half ? 'star_half' : 'star'}
            fill={filled || half}
            style={{ fontSize: size, opacity: filled || half ? 1 : 0.35 }}
          />
        )
      })}
    </span>
  )
}
