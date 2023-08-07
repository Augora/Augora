import React from "react"
import { AnimatePresence, motion, Variants } from "framer-motion"

interface IMission {
  nom: string
  fonction: string
  color: string
  permanente: boolean
}

const container: Variants = {
  hidden: { opacity: 0, transition: { duration: 0.1, ease: "easeInOut", when: "afterChildren", staggerChildren: 0.05 } },
  visible: {
    opacity: 1,
    transition: { duration: 0.1, ease: "easeInOut", when: "beforeChildren", staggerChildren: 0.05 },
  },
}

const item: Variants = {
  hidden: { opacity: 0, transition: { duration: 0.2, ease: "easeInOut" } },
  visible: { opacity: 1, transition: { duration: 0.2, ease: "easeInOut" } },
}

function Mission({ nom, fonction, color, permanente }: IMission) {
  return (
    <motion.div className="missions__bloc" variants={container} initial="hidden" animate="visible" exit="hidden">
      <motion.div className="missions__type" style={{ color }} variants={item}>
        {permanente && "Commission permanente"}
      </motion.div>
      <motion.div className="missions__nom" variants={item}>
        {nom}
      </motion.div>
      <motion.div className="missions__responsabilite" style={{ color }} variants={item}>
        {fonction}
      </motion.div>
    </motion.div>
  )
}

export default Mission
