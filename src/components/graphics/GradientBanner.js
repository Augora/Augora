import React from "react"

const numberOfRect = 20
const svgWidth = 1200
const svgHeight = 60
const rectWidth = 100
const rectSkew = 25
// const rectMaxX = svgWidth - rectWidth / 2

const gbStyles = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
}

const Rectangles = () => {
  const rects = []
  for (let i = 0; i < numberOfRect; i++) {
    const xPos = (svgWidth / numberOfRect) * i
    rects.push(
      <rect
        key={i}
        x={xPos}
        y={0}
        width={rectWidth}
        height={svgHeight}
        style={{
          fill: `rgba(255,255,255,${Math.random() * 0.05 + 0.05})`,
          transform: `skew(-${rectSkew}deg) translate3d(${
            Math.random() * 500 - 250
          }px, 0, 0)`,
        }}
      />
    )
  }

  return rects
}

export default function GradientBanner() {
  return (
    <div
      className="gradient-banner__container"
      style={{
        height: "100%",
        width: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
      }}
    >
      <svg
        version="1.1"
        id="gradient-banner"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        style={gbStyles}
        preserveAspectRatio="xMinYMin slice"
      >
        <g>{Rectangles()}</g>
      </svg>
    </div>
  )
}
