import React, { useState } from "react"
import dynamic from "next/dynamic"
import { getHSLLightVariation } from "utils/style/color"
const GradientBanner = dynamic(() => import("../graphics/GradientBanner"), {
  ssr: false,
})

/**
 * Renvoie le component titre de page
 * @param {string} [title] Titre de la page, optionnel
 * @param {Group.HSLDetail} [color] Couleur de la bannière, optionnel
 */
export default function PageTitle(props: { title?: string; color?: Group.HSLDetail }) {
  const [hovered, setHovered] = useState(false)

  let style: React.CSSProperties = {}
  if (props.color) {
    const gradientEnd = getHSLLightVariation(props.color, -10)
    style = {
      backgroundImage: `linear-gradient(to right, hsl(${props.color.H}, ${props.color.S}%, ${props.color.L}%), hsl(${props.color.H}, ${props.color.S}%, ${gradientEnd}%)`,
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
