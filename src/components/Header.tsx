import { Icon } from './Icon'

interface HeaderProps {
  onOpenFilters: () => void
}

export function Header({ onOpenFilters }: HeaderProps) {
  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__left">
          <button
            className="icon-btn filters-toggle"
            onClick={onOpenFilters}
            aria-label="Open filters"
          >
            <Icon name="tune" />
          </button>
          <a className="brand" href="#">
            Orla &amp; Vine
          </a>
          <nav className="nav">
            <a href="#">Shop</a>
            <a href="#" className="active">
              Discovery
            </a>
            <a href="#">Our Story</a>
          </nav>
        </div>
        <div className="header__right">
          <button className="icon-btn" aria-label="Search">
            <Icon name="search" />
          </button>
          <button className="icon-btn" aria-label="Bag">
            <Icon name="shopping_bag" />
            <span className="dot" />
          </button>
          <button className="icon-btn" aria-label="Account">
            <Icon name="person" />
          </button>
        </div>
      </div>
    </header>
  )
}
