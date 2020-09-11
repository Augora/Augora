import React from "react"

export interface ITooltip {
  title?: string
  color?: string
  age?: number
  nbDeputes: number
  totalDeputes: number
  hideNbDeputes?: boolean
}

/**
 * Returns a Tooltip in a div tag
 *
 * @export
 * @param {number} nbDeputes - Mandatory number of deputies
 * @param {number} totalDeputes - Mandatory total of deputies
 * @param {string} [title] - Optional title of the tooltip : the group, gender, or whatever
 * @param {string} [color] - Optional color of the title
 * @param {number} [age] - Optional age value for the age chart
 * @param {boolean} [hideNbDeputes] - Optional boolean for hiding the number of deputies
 * @returns
 */
export default function Tooltip(props: ITooltip) {
  return (
    <div className="tooltip">
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
      <div
        className={`tooltip__numbers ${
          props.hideNbDeputes ? "tooltip__numbers--centered" : ""
        }`}
      >
        {!props.hideNbDeputes ? (
          <div className="tooltip__value">
            <span>{props.nbDeputes}</span>
            <small>{props.nbDeputes > 1 ? "Députés" : "Député"}</small>
          </div>
        ) : null}
        <div className="tooltip__percentage">
          {Math.round(((props.nbDeputes * 100) / props.totalDeputes) * 10) / 10}
          %
        </div>
      </div>
    </div>
  )
}
