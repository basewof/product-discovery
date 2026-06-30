import { Icon } from './Icon'

interface PaginationProps {
  page: number
  totalPages: number
  pageSize: number
  onPage: (page: number) => void
  onPageSize: (size: number) => void
}

const PAGE_SIZES = [12, 24, 48, 96]

/** Build a compact page list e.g. 1 … 4 5 [6] 7 8 … 20 */
function buildPages(page: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | '…')[] = [1]
  const start = Math.max(2, page - 1)
  const end = Math.min(total - 1, page + 1)
  if (start > 2) pages.push('…')
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < total - 1) pages.push('…')
  pages.push(total)
  return pages
}

export function Pagination({
  page,
  totalPages,
  pageSize,
  onPage,
  onPageSize,
}: PaginationProps) {
  if (totalPages <= 1) {
    return (
      <div className="pagination">
        <span className="page-size">
          Show
          <select
            value={pageSize}
            onChange={(e) => onPageSize(Number(e.target.value))}
          >
            {PAGE_SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          per page
        </span>
      </div>
    )
  }

  return (
    <div className="pagination">
      <button
        className="page-btn"
        onClick={() => onPage(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        <Icon name="chevron_left" />
      </button>

      {buildPages(page, totalPages).map((p, i) =>
        p === '…' ? (
          <span key={`e${i}`} className="page-ellipsis">
            …
          </span>
        ) : (
          <button
            key={p}
            className={`page-btn${p === page ? ' active' : ''}`}
            onClick={() => onPage(p)}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        ),
      )}

      <button
        className="page-btn"
        onClick={() => onPage(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
      >
        <Icon name="chevron_right" />
      </button>

      <span className="page-size">
        Show
        <select
          value={pageSize}
          onChange={(e) => onPageSize(Number(e.target.value))}
        >
          {PAGE_SIZES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        per page
      </span>
    </div>
  )
}
