import React from "react"

export const Tooltip = (tooltip, total) => {
  return (
    <div
      className="tooltip"
      style={{
        whiteSpace: "pre",
        backgroundColor: "white",
        boxShadow: "0px 5px 5px rgba(0, 0, 0, 0.15)",
        padding: 10,
        borderRadius: 5,
        fontFamily: "Open Sans",
        minWidth: 200,
      }}
    >
      <div
        className="tooltip__age"
        style={{
          fontSize: 24,
          display: "flex",
          marginBottom: 10,
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontWeight: "bold",
            paddingRight: 10,
          }}
        >
          {tooltip.indexValue}
        </span>
        Ans
      </div>
      <div
        className="tooltip__groupe"
        style={{
          marginBottom: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            width: "12px",
            height: "12px",
            background: `${tooltip.color}`,
            marginRight: "7px",
          }}
        ></span>
        <span>{tooltip.id}</span>
      </div>
      <div
        className="tooltip__numbers"
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 24,
          fontWeight: "bold",
        }}
      >
        <div
          className="tooltip__value"
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 13,
            fontWeight: "normal",
          }}
        >
          <span
            style={{
              fontSize: 24,
              fontWeight: "bold",
              paddingRight: 10,
            }}
          >
            {tooltip.value}
          </span>
          Députés
        </div>
        <div className="tooltip__percentage">
          {Math.round(((tooltip.value * 100) / total) * 100) / 100}%
        </div>
      </div>
    </div>
  )
}
