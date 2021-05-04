import React, { useState, useEffect } from "react"

interface IPopin {
  isInitialState: boolean
  children: React.ReactNode
}

/**
 * Renvoie la popin des filtres actifs
 * @param {boolean} isInitialState Si les filtres sont à leur valeur par défaut ou non
 */
export default function Popin({ isInitialState, children }: IPopin) {
  const [visible, setVisible] = useState(!isInitialState)

  useEffect(() => {
    setVisible(!isInitialState)
  }, [isInitialState])

  if (visible) {
    return (
      <div className="popin">
        <div className="popin__content">{children}</div>
        <button className="popin__close" onClick={() => setVisible(false)}>
          <span></span>
          <span></span>
        </button>
      </div>
    )
  } else {
    return null
  }
}
