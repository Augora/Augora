import { useState } from "react"

const usePopup = () => {
  const [isPopupVisible, setPopupVisible] = useState(false)

  function togglePopup() {
    document.querySelector("html").classList.toggle("unscrollable")
    setPopupVisible(!isPopupVisible)
  }

  return {
    isPopupVisible,
    togglePopup,
  }
}

export default usePopup
