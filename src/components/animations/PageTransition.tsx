import React, { useState } from "react"
import { useRouter } from "next/router"
import { AnimatePresence, motion } from "framer-motion"
import LoadingScreen from "components/frames/LoadingScreen"

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const { asPath } = useRouter()

  const [slideVisible, setSlideVisible] = useState(false)

  return (
    <div className="page-transition">
      <AnimatePresence mode="wait">
        <motion.div
          key={asPath}
          animate={{ opacity: 1 }}
          initial={false}
          exit={{ opacity: 0.9 }}
          transition={{ duration: 0.2 }}
          onAnimationStart={() => setSlideVisible(true)}
        >
          {children}
        </motion.div>
      </AnimatePresence>
      <AnimatePresence>
        {slideVisible && (
          <LoadingScreen
            initial={{ scaleX: 0, transformOrigin: "left" }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0, transformOrigin: "right", transition: { ease: "easeInOut", duration: 0.8 } }}
            transition={{ ease: "easeInOut", duration: 0.2 }}
            onAnimationComplete={() => setSlideVisible(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default PageTransition
