import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { AnimatePresence, motion } from "framer-motion"
import LoadingSpinner from "components/spinners/loading-spinner/LoadingSpinner"

export default function PageLoading() {
  const router = useRouter()

  const [isLoading, setLoading] = useState(false)

  let timer: NodeJS.Timeout

  const onChange = () => {
    timer = setTimeout(() => setLoading(true), 500)
  }
  const onComplete = () => {
    clearTimeout(timer)
    setLoading(false)
  }

  useEffect(() => {
    router.events.on("routeChangeStart", onChange)
    router.events.on("routeChangeComplete", onComplete)
    router.events.on("routeChangeError", onComplete)

    return () => {
      router.events.off("routeChangeStart", onChange)
      router.events.off("routeChangeComplete", onComplete)
      router.events.off("routeChangeError", onComplete)

      clearTimeout(timer)
    }
  }, [])

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="loading-spinner"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { delay: 1 } }}
          transition={{
            duration: 0.2,
          }}
        >
          <LoadingSpinner />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
