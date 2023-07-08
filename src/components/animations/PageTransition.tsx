import React, { useState } from "react"
import { useRouter } from "next/router"
import { AnimatePresence, motion } from "framer-motion"

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useRouter()
  const [isAnimating, setIsAnimating] = useState(false)

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="page-transition"
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={!isAnimating && { opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        onAnimationStart={() => setIsAnimating(true)}
        onAnimationComplete={() => setIsAnimating(false)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default PageTransition
