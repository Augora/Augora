import React from "react"

export const Tooltip = tooltip => {
  return (
    <div className="tooltip" style={{ whiteSpace: "pre" }}>
      <span
        style={{
          display: "inline-block",
          width: "12px",
          height: "12px",
          background: `${tooltip.data.color}`,
          marginRight: "7px",
        }}
      ></span>
      <span>
        {tooltip.data.label} - {tooltip.data.value}
      </span>
    </div>
  )
}
