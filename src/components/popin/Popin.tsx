import React, { useState, useEffect } from "react"

interface IPopin {
  children: React.ReactNode
  displayed?: boolean
}

/**
 * Renvoie la popin des filtres actifs
 * @param {boolean} isInitialState Si les filtres sont à leur valeur par défaut ou non
 * @param {Function} setVisible Callback pour faire disparaitre la popin
 */
export default function Popin({ children, displayed }: IPopin) {
  const [visible, setVisible] = useState(displayed !== undefined ? displayed : true)

  useEffect(() => {
    setVisible(displayed)
  }, [displayed])

  return (
    <div className={`popin ${visible ? 'visible' : 'hidden'}`}>
      <div className="popin__content">{children}</div>
      <button className="popin__close" onClick={() => setVisible(!visible)}>
        <span></span>
        <span></span>
      </button>
    </div>
  )
}
