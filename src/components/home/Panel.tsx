import React from "react"
import { motion } from "framer-motion"

function Panel({
  className,
  orientation,
  shared = false,
  children,
}: {
  className: string
  orientation: string
  shared?: boolean
  children: React.ReactNode
}) {
  return (
    <motion.div
      className={`${className} panel panel--${orientation} ${shared ? "panel--shared" : ""}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  )
}

export default Panel
