import React from "react"
import CustomControl from "components/maps/CustomControl"

/**
 * Renvoie un button formatté pour la map
 */
export default function MapButton(props: React.HTMLAttributes<HTMLButtonElement>) {
  const { children, ...other } = props

  return (
    <CustomControl>
      <button {...other} className={`map__btn ${props.className ? props.className : ""}`}>
        {children}
      </button>
    </CustomControl>
  )
}
