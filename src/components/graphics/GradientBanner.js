import React from "react"

const svgWidth = 1200
const rectWidth = 40

const gbStyles = {
  background: "linear-gradient(to right, #30e3ca, #19dde3)",
  enableBackground: "new 0 0 1000 1000",
}
const gbRectStyles = {
  fill: "rgba(255,255,255,0.25)",
  transform: "skew(-10deg)",
}

const numberOfRect = 20

const Rectangles = () => {
  const rects = []
  for (let i = 0; i < numberOfRect; i++) {
    const xPos = Math.random() * (1200 - rectWidth / 2)
    rects.push(
      <rect
        key={i}
        x={xPos}
        y={0}
        width="40"
        height="50"
        style={gbRectStyles}
      />
    )
  }

  return rects
}

export default function GradientBanner() {
  return (
    <div className="gradient-banner__container">
      <svg
        version="1.1"
        id="gradient-banner"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox={`0 0 ${svgWidth} 50`}
        style={gbStyles}
      >
        <g>{Rectangles()}</g>
      </svg>
    </div>
  )
}
