import React from "react"
import CustomControl from "components/maps/CustomControl"

interface IMapButton {
  onClick?: <T>(args?: T) => void
  className?: string
  title?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

/**
 * Renvoie un map button component, pour qu'il affiche une icone, lui passer une image en child
 * @param {string} [className] Il faut lui donner la classe "visible" pour qu'il soit visible
 */
export default function MapButton({
  onClick = () => {},
  className = "",
  title = "",
  style = {},
  children,
}: IMapButton) {
  return (
    <CustomControl>
      <button
        className={`map__navigation-custom ${className}`}
        style={style}
        title={title}
        onClick={onClick}
      >
        <div className="icon-wrapper">{children}</div>
      </button>
    </CustomControl>
  )
}
