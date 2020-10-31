import React from "react"

export interface ITooltip {
  children?: React.ReactNode
  title?: string
  color?: string
  age?: number
  nbDeputes?: number
  totalDeputes?: number
  style?: React.CSSProperties
  className?: string
}

/**
 * Returns a Tooltip in a div tag
 * @param {number} nbDeputes - Mandatory number of deputies
 * @param {number} totalDeputes - Mandatory total of deputies
 * @param {string} [title] - Optional tooltip title: group, gender, whatever
 * @param {string} [color] - Optional title color
 * @param {number} [age] - Optional age value for age chart
 * @param {boolean} [hideNbDeputes] - Optional boolean for hiding the number of deputies
 */
export default function Tooltip(props: ITooltip) {
  return (
    <div
      className={`tooltip ${props.className ? props.className : ""}`}
      style={props.style}
    >
      {props.age ? (
        <div className="tooltip__age">
          <span>{props.age}</span>
          <small>Ans</small>
        </div>
      ) : null}
      {props.title ? (
        <div
          className="tooltip__title"
          style={{
            color: `${props.color ? props.color : "#4d4d4d"}`,
          }}
        >
          {props.title}
        </div>
      ) : null}
      <div className="tooltip__content">{props.children}</div>
      {props.totalDeputes !== undefined && props.nbDeputes !== undefined ? (
        <div className="tooltip__numbers">
          <div className="tooltip__value">
            <span>{props.nbDeputes}</span>
            <small>{props.nbDeputes > 1 ? "Députés" : "Député"}</small>
          </div>
          <div className="tooltip__percentage">
            {props.totalDeputes > 0
              ? Math.round(
                  ((props.nbDeputes * 100) / props.totalDeputes) * 10
                ) / 10
              : 0}
            %
          </div>
        </div>
      ) : null}
    </div>
  )
}
