import React from "react"

export interface ITooltip extends Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "title"> {
  children?: React.ReactNode
  title?: string
  color?: string
  age?: number | string
  nbDeputes?: number
  totalDeputes?: number
}

/**
 * Returns a Tooltip in a div tag, all parameters are optional
 * @param {number} [nbDeputes] Number of deputies
 * @param {number} [totalDeputes] Total of deputies
 * @param {string} [title] Tooltip title: group, gender, whatever
 * @param {string} [color] Title color
 * @param {number} [age] Age value for age chart
 */
export default function Tooltip(props: ITooltip) {
  const { nbDeputes, totalDeputes, children, title, color, age, className, ...restProps } = props

  return (
    <div className={`tooltip ${className ? className : ""}`} {...restProps}>
      {age ? (
        <div className="tooltip__age">
          <span>{age}</span>
          <small>Ans</small>
        </div>
      ) : null}
      {title ? (
        <div
          className="tooltip__title"
          style={{
            color: `${color ? color : "#4d4d4d"}`,
          }}
        >
          {title}
        </div>
      ) : null}
      <div className="tooltip__content">{children}</div>
      {totalDeputes !== undefined && nbDeputes !== undefined ? (
        <div className="tooltip__numbers">
          <div className="tooltip__value">
            <span>{nbDeputes}</span>
            <small>{nbDeputes > 1 ? "Députés" : "Député"}</small>
          </div>
          <div className="tooltip__percentage">
            {totalDeputes > 0 ? Math.round(((nbDeputes * 100) / totalDeputes) * 10) / 10 : 0}%
          </div>
        </div>
      ) : null}
    </div>
  )
}
