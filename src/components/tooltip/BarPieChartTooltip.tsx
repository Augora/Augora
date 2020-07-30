import React from "react"

export const Tooltip = (tooltip, total) => {
  return (
    <div className="bar-pie__tooltip">
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
