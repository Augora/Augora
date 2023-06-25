import React, { useState } from "react"
import { useRouter } from "next/router"
import { AnimatePresence, motion } from "framer-motion"
import LoadingScreen from "components/frames/LoadingScreen"

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useRouter()

  return (
    <div className="page-transition">
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
      {/* <AnimatePresence>
        {slideVisible && (
          <LoadingScreen
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%", transition: { ease: "easeIn", duration: 0.3 } }}
            transition={{ ease: "easeOut", duration: 0.3 }}
            onAnimationComplete={() => setSlideVisible(false)}
          />
        )}
      </AnimatePresence> */}
    </div>
  )
}

export default PageTransition
