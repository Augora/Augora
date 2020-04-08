import React from "react"

export const Tooltip = (tooltip, total) => {
  console.log(tooltip)
  return (
    <div
      className="tooltip"
      style={{
        whiteSpace: "pre",
        backgroundColor: "white",
        padding: 10,
        borderRadius: 10,
        fontFamily: "Open Sans",
      }}
    >
      <div className="tooltip__age">
        <span>{tooltip.indexValue}</span> Ans
      </div>
      <div className="tooltip__groupe">
        <span
          style={{
            display: "inline-block",
            width: "12px",
            height: "12px",
            background: `${tooltip.color}`,
            marginRight: "7px",
          }}
        ></span>
        <span>{tooltip.id}</span>
      </div>
      <div className="tooltip__numbers">
        <div className="tooltip__value">
          <span>{tooltip.value}</span> Députés
        </div>
        <div className="tooltip__percentage">
          {Math.round(((tooltip.value * 100) / total) * 100) / 100}%
        </div>
      </div>
    </div>
  )
}
