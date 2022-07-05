import { useState } from "react"

const usePopup = () => {
  const [isShowing, setIsShowing] = useState(false)

  function toggle() {
    console.log("test2")
    setIsShowing(!isShowing)
  }

  return {
    isShowing,
    toggle,
  }
}

export default usePopup
