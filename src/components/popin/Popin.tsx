import React, { useState, useEffect } from "react"

interface IPopin {
  children: React.ReactNode
  setVisible?: (arg: boolean) => void
}

/**
 * Renvoie la popin des filtres actifs
 * @param {boolean} isInitialState Si les filtres sont à leur valeur par défaut ou non
 * @param {Function} setVisible Callback pour faire disparaitre la popin
 */
export default function Popin({ children, setVisible }: IPopin) {
  return (
    <div className="popin">
      <div className="popin__content">{children}</div>
      {setVisible && (
        <button className="popin__close" onClick={() => setVisible(false)}>
          <span></span>
          <span></span>
        </button>
      )}
    </div>
  )
}
