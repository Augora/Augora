import React from "react"

export default function HomeGradientBar({ pos }: { pos: "right" | "left" }) {
  return (
    <svg
      version="1.1"
      id="gradient-home"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox={`0 0 100 100`}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        opacity: 0.3,
        zIndex: -1,
      }}
      preserveAspectRatio={pos === "left" ? "xMinYMax meet" : "xMaxYMin meet"}
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00bbcc" />
          <stop offset="100%" stopColor="#14ccae" />
        </linearGradient>
      </defs>
      <rect
        x={pos === "left" ? "-20px" : "82px"}
        y={0}
        width={"20px"}
        height={100}
        style={{
          fill: "url(#grad1)",
          transform: "skew(10deg)",
        }}
      />
    </svg>
  )
}
