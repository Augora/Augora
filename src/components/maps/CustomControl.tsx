import React from "react"
import { _useMapControl as useMapControl } from "react-map-gl"

interface ICustomControlProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  capture?: boolean
}

/**
 * Renvoie un CustomControl contenant un div contenant les children, avec toutes les props captures = true par défaut
 */
export default function CustomControl({ className, children, capture, ...props }: ICustomControlProps) {
  const bool = capture ? capture : true

  const { context, containerRef } = useMapControl({
    captureScroll: bool,
    captureDrag: bool,
    captureClick: bool,
    captureDoubleClick: bool,
    capturePointerMove: bool,
  })

  return (
    <div {...props} className={`mapboxgl-ctrl-custom ${className ? className : ""}`} ref={containerRef}>
      {children}
    </div>
  )
}
