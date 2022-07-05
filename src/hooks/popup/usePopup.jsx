import { useState } from "react"

const usePopup = () => {
  const [isShowing, setIsShowing] = useState(false)

  function toggle() {
    document.querySelector("html").classList.toggle("unscrollable")
    setIsShowing(!isShowing)
  }

  return {
    isShowing,
    toggle,
  }
}

export default usePopup
