import React from "react"

export const Tooltip = (tooltip, total) => {
  return (
    <div className="graph__tooltip">
      {tooltip.indexValue != null && tooltip.indexValue >= 0 ? (
        <div className="tooltip__age">
          <span>{tooltip.indexValue}</span>
          Ans
        </div>
      ) : null}
      <div
        className="tooltip__groupe"
        style={{
          color: `${tooltip.color}`,
        }}
      >
        {tooltip.id}
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
