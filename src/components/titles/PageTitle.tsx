import React, { useState } from "react"
import dynamic from "next/dynamic"
import { getHSLAsArray } from "../../utils/style/color"
const GradientBanner = dynamic(() => import("../graphics/GradientBanner"), {
  ssr: false,
})

export default function PageTitle(props: { title: string, color: string }) {
  const [hovered, setHovered] = useState(false)

  let style = {}
  if (props.color) {
    const colorArray = getHSLAsArray(props.color)
    style = {
      backgroundImage: `linear-gradient(to right, hsl(${colorArray[1]}, ${colorArray[2]}%, ${colorArray[3]}%), hsl(${colorArray[1]}, ${colorArray[2]}%, ${Math.max(colorArray[3] - 5, 0)}%)`
    }
  }

  return (
    <div
      className={`page-title ${hovered ? "page-title--hovered" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={style}
    >
      {props.title ? (
        <div className="page-title__container">
          <h1 className="page-title__title">{props.title}</h1>
          <p className="page-title__title">{props.title}</p>
        </div>
      ) : null}
      <GradientBanner />
    </div>
  )
}
