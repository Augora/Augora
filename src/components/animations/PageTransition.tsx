import React, { useState } from "react"
import { useRouter } from "next/router"
import { AnimatePresence, motion } from "framer-motion"

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useRouter()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="page-transition"
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        onAnimationComplete={() => window?.scrollTo({ top: 0 })}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default PageTransition
