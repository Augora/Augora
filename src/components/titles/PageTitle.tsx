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

  let style: React.CSSProperties = {}
  if (color) {
    const gradientEnd = getHSLLightVariation(color, -10)
    style = {
      backgroundImage: `linear-gradient(to right, hsl(${color.H}, ${color.S}%, ${color.L}%), hsl(${color.H}, ${color.S}%, ${gradientEnd}%)`,
    }
  }

  console.log(isScrolled, isTransparent)

  return (
    <motion.div
      className={`page-title ${hovered ? "page-title--hovered" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={style}
      animate={{
        y: isScrolled && !title ? -15 : isScrolled ? -75 : 0,
        height: title ? "auto" : 0,
        padding: isTransparent && !isScrolled ? 0 : "60px 0 0",
      }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <AnimatePresence mode="wait">
        {title && (
          <motion.div
            key={title}
            className="page-title__container"
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={!isAnimating && { x: -200, opacity: 0 }}
            onAnimationStart={() => setIsAnimating(true)}
            onAnimationComplete={() => setIsAnimating(false)}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <motion.h1
              className="page-title__title"
              animate={!isScrolled ? { y: 0, opacity: 1 } : { y: "-100%", opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              {title}
            </motion.h1>
            <motion.p
              className="page-title__title"
              animate={isScrolled ? { y: "75%", opacity: 1 } : { y: "100%", opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              {title}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
      {/* <GradientBanner /> */}
    </motion.div>
  )
}
