import React, { useState } from "react"
import { useRouter } from "next/router"
import { AnimatePresence, motion } from "framer-motion"

const PageTransition = ({ children, paddingTop }: { children: React.ReactNode; paddingTop?: number }) => {
  const { pathname } = useRouter()
  const [isAnimating, setIsAnimating] = useState(false)

  return (
    <AnimatePresence mode="wait">
      <motion.main
        className="page-transition"
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={!isAnimating && { opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        onAnimationStart={() => setIsAnimating(true)}
        onAnimationComplete={() => setIsAnimating(false)}
      >
        <motion.main className="layout" initial={false} animate={{ paddingTop: paddingTop ?? 0 }}>
          {children}
        </motion.main>
      </motion.main>
    </AnimatePresence>
  )
}

export default PageTransition
