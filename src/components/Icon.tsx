interface IconProps {
  name: string
  fill?: boolean
  className?: string
  style?: React.CSSProperties
}

export function Icon({ name, fill, className, style }: IconProps) {
  return (
    <span
      className={`material-symbols-outlined${fill ? ' fill' : ''}${
        className ? ' ' + className : ''
      }`}
      style={style}
      aria-hidden="true"
    >
      {name}
    </span>
  )
}
