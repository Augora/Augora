import React from "react"

const numberOfRect = 20
const svgWidth = 1200
const svgHeight = 60
const rectWidth = 100
const rectSkew = 25
// const rectMaxX = svgWidth - rectWidth / 2

const gbStyles: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
}

const Rectangles = () => {
  const rects: JSX.Element[] = []
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
          fill: `rgba(255,255,255,${Math.random() * 0.025 + 0.025})`,
          transform: `skew(-${rectSkew}deg) translate3d(${(Math.random() * 500) - 250}px, 0, 0)`,
          // filter: `blur(${Math.random() * 1 - 0.5}px)`,
        }}
      />
    )
  }

  return rects
}

export default function GradientBanner() {
  // \/ In case we want to "fix" the bars moving
  // const rectangles = useMemo(() => Rectangles(), []);
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
