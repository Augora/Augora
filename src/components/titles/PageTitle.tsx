import React, { useState } from "react"
import dynamic from "next/dynamic"
import { getHSLLightVariation } from "utils/style/color"
import { AnimatePresence, motion } from "framer-motion"
// const GradientBanner = dynamic(() => import("../graphics/GradientBanner"), {
//   ssr: false,
// })

/**
 * Renvoie le component titre de page
 * @param {string} [title] Titre de la page, optionnel
 * @param {Group.HSLDetail} [color] Couleur de la bannière, optionnel
 */
export default function PageTitle({ title, color, isScrolled }: { title?: string; color?: Color.HSL; isScrolled?: boolean }) {
  const [hovered, setHovered] = useState(false)

  let style: React.CSSProperties = {}
  if (color) {
    const gradientEnd = getHSLLightVariation(color, -10)
    style = {
      backgroundImage: `linear-gradient(to right, hsl(${color.H}, ${color.S}%, ${color.L}%), hsl(${color.H}, ${color.S}%, ${gradientEnd}%)`,
    }
  }

  return (
    <div
      className={`page-title ${hovered ? "page-title--hovered" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={style}
    >
      <AnimatePresence mode="wait">
        {title && (
          <motion.div
            key={title}
            className="page-title__container"
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -200, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <h1 className="page-title__title">{title}</h1>
            <p className="page-title__title">{title}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* <GradientBanner /> */}
    </div>
  )
}
