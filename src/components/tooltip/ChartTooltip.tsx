import React from "react"

export const Tooltip = (tooltip, total, isAgeTooltip = false) => {
  return (
    <div className="graph__tooltip">
      {isAgeTooltip ? (
        <div className="tooltip__age">
          <span>{tooltip.indexValue}</span>
          Ans
        </div>
      ) : null}
      <div className="tooltip__groupe">
        <span
          className="tooltip__groupe--color"
          style={{
            background: `${tooltip.color}`,
          }}
        ></span>
        <span>{tooltip.id}</span>
      </div>
      <div className="tooltip__numbers">
        <div className="tooltip__value">
          <span>{tooltip.value}</span>
          Députés
        </div>
        <div className="tooltip__percentage">
          {Math.round(((tooltip.value * 100) / total) * 100) / 100}%
        </div>
      </div>
    </div>
  )
}
