import React, { useEffect, useState } from "react"
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
export default function PageTitle({
  title,
  color,
  isScrolled,
  isTransparent,
}: {
  title?: string
  color?: Color.HSL
  isScrolled?: boolean
  isTransparent?: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [bgColor, setBgColor] = useState<string>(null)

  useEffect(() => {
    if (color)
      setBgColor(
        `linear-gradient(to right, hsl(${color.H}, ${color.S}%, ${color.L}%), hsl(${color.H}, ${color.S}%, ${getHSLLightVariation(
          color,
          -10
        )}%)`
      )
  }, [color])

  return (
    <motion.div
      className={`page-title ${hovered ? "page-title--hovered" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={color && { backgroundImage: bgColor }}
      animate={{
        y: isScrolled && !title ? -130 : isScrolled ? -75 : !title && isTransparent ? -175 : !title ? -115 : 0,
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <AnimatePresence mode="wait">
        {title && (
          <motion.div
            key={title}
            className="page-title__container"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={!isAnimating && { y: 100, opacity: 0 }}
            onAnimationStart={() => setIsAnimating(true)}
            onAnimationComplete={() => setIsAnimating(false)}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <h1 className="page-title__title">{title}</h1>
            <p className="page-title__title">{title}</p>
          </motion.div>
        )}
      </AnimatePresence>
      {/* <GradientBanner /> */}
    </motion.div>
  )
}
