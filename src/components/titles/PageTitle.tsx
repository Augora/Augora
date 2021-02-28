import React, { useState } from "react"
import dynamic from "next/dynamic"
const GradientBanner = dynamic(() => import("../graphics/GradientBanner"), {
  ssr: false,
})

export default function PageTitle(props: { title: string, color: Group.HSLDetail }) {
  const [hovered, setHovered] = useState(false)

  let style = {}
  if (props.color) {
    style = {
      backgroundImage: `linear-gradient(to right, hsl(${props.color.H}, ${props.color.S}%, ${props.color.L}%), hsl(${props.color.H}, ${props.color.S}%, ${Math.max(props.color.L - 5, 0)}%)`
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
