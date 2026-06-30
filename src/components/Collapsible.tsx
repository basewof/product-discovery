import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Icon } from './Icon'

interface CollapsibleProps {
  icon: string
  title: string
  defaultOpen?: boolean
  children: ReactNode
}

export function Collapsible({
  icon,
  title,
  defaultOpen = true,
  children,
}: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen)
  const bodyRef = useRef<HTMLDivElement>(null)
  const [maxHeight, setMaxHeight] = useState<number | undefined>(undefined)

  // Measure content so the height animation works regardless of content length.
  useEffect(() => {
    if (!bodyRef.current) return
    const measure = () => {
      if (bodyRef.current) setMaxHeight(bodyRef.current.scrollHeight*1.1)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(bodyRef.current)
    return () => ro.disconnect()
  }, [children])

  return (
    <div className="filter-block">
      <button
        className={`collapsible-header${open ? ' open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="label">
          <Icon name={icon} />
          {title}
        </span>
        <Icon name="expand_more" className="chevron" />
      </button>
      <div
        className="collapsible-body"
        style={{
          maxHeight: open ? maxHeight : 0,
          opacity: open ? 1 : 0,
        }}
      >
        {/* flow-root keeps children's margins inside the box so scrollHeight
            measures the full content height (no margin-collapse undercount). */}
        <div ref={bodyRef} style={{ display: 'flow-root' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
