import type { ReactNode } from 'react'

type CardProps = {
  title: string
  description?: string
  footer?: ReactNode
  children?: ReactNode
}

export function Card({ title, description, footer, children }: CardProps) {
  return (
    <article className="card">
      <h3 className="card__title">{title}</h3>
      {description ? <p className="card__description">{description}</p> : null}
      {children}
      {footer ? <div className="card__footer">{footer}</div> : null}
    </article>
  )
}
