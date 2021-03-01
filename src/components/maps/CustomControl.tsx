import React from "react"
import { _useMapControl as useMapControl } from "react-map-gl"

interface ICustomControlProps {
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

/**
 * Renvoie un CustomControl contenant un div contenant les children, avec toutes les props captures = true
 *
 * Utilisé pour afficher un overlay sur la map qui ne trigger pas la navigation de la map en dessous
 */
export default function CustomControl({ className, style, children }: ICustomControlProps) {
  const { context, containerRef } = useMapControl({
    captureScroll: true,
    captureDrag: true,
    captureClick: true,
    captureDoubleClick: true,
    capturePointerMove: true,
  })

  return (
    <div className={`mapboxgl-ctrl-custom ${className ? className : ""}`} style={style} ref={containerRef}>
      {children}
    </div>
  )
}
