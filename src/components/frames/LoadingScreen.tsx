import React from "react"
import { HTMLMotionProps, motion } from "framer-motion"

function LoadingScreen(props: Omit<HTMLMotionProps<"div">, "id">) {
  return (
    <motion.div id="loading-screen" {...props}>
      {/* Silence is golden */}
    </motion.div>
  )
}

export default LoadingScreen
